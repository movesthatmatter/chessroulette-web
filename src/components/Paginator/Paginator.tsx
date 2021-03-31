import { useEffect, useState } from 'react';
import React from 'react';
import {Game} from '../../modules/Games/types';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { borderRadius, colors, floatingShadow } from 'src/theme';

type Props = {
  pageSize: number;
  items : Game[];
  onChangePage : (items: Game[]) => void;
};
export const Paginator = ({ 
    pageSize = 5,
    items,
    onChangePage
}: Props) => {

  const cls = useStyles();
  const [pager, setPager] = useState({
      startIndex : 1,
      endIndex : 1,
      pages : [1],
      totalPages : 1,
      startPage: 1,
      endPage : 1,
      currentPage : 1,
  });

  useEffect(() => {
    if (items.length > 0){
        setPage(1)
    }
  },[items])

  const setPage = (page : number) => {
      if (page < 1 || page > pager.totalPages){
          return;
      }
      const updatedPager = getPager(page);
      const pageOfItems = items.slice(updatedPager.startIndex, updatedPager.endIndex + 1)
      setPager(updatedPager);
      onChangePage(pageOfItems);
  }
  
  const getPager = (currentPage : number) => {
    let startPage : number, endPage : number;
    const totalPages = Math.ceil(items.length / pageSize);
    if (totalPages <= 10){
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= 6){
            startPage = 1;
            endPage = 10;
        } else if (currentPage + 4 >= totalPages){
            startPage = totalPages - 9;
            endPage = totalPages;
        } else {
            startPage = currentPage - 5;
            endPage = currentPage + 4;
        }
    }
    const startIndex = (currentPage - 1 ) * pageSize;
    const endIndex = Math.min(startIndex + pageSize -1, items.length - 1);
    const pages = createRange(startPage, endPage);
    return {startIndex, endIndex, pages, totalPages, startPage, endPage, currentPage}
  }
  
  if (!pager.pages || pager.pages.length <= 1){
      return null;
  }
  return (
      <div className={cls.pagination}>
          <div className={cx(cls.currentPage, {
              [cls.disabled] : pager.currentPage === 1
          })}>
              <a onClick={() => setPage(1)}>First</a>
          </div>
          <div className={cx(cls.currentPage, {
              [cls.disabled] : pager.currentPage === 1
          })}>
              <a onClick={() => setPage(pager.currentPage - 1)}>Previous</a>
          </div>
            {pager.pages.map((page, index)=> (
                <div key={index} className={cx(cls.page,{
                    [cls.active] : pager.currentPage === page
                })}>
                    <a onClick={() => setPage(page)}>{page}</a>
                </div>
            ))}
          <div className={cx(cls.currentPage,{
              [cls.disabled] : pager.currentPage === pager.totalPages
          })}>
              <a onClick={() => setPage(pager.currentPage + 1)}>Next</a>
          </div>
          <div className={cx(cls.currentPage,{
              [cls.disabled] : pager.currentPage === pager.totalPages
          })}>
              <a onClick={() => setPage(pager.totalPages)}>Last</a>
          </div>
      </div>
  )
};

const useStyles = createUseStyles({
  container: {
  },
  pagination:{
      display:'flex',
      ...borderRadius
  },
  disabled: {
      cursor: 'not-allowed',
      color: colors.neutralDark,
  },
  currentPage:{
      padding:'0px 10px',
      border : '1px solid #ddd',
        '&:first-child' : {
            borderTopLeftRadius : '16px',
            borderBottomLeftRadius: '16px'
        },
        '&:last-child' : {
            borderTopRightRadius: '16px',
            borderBottomRightRadius : '16px'
        }
  },
  active:{
      color:colors.primary
  },
  page : {
      padding: '0px 10px',
      border : '1px solid #ddd'
  },
});

function createRange(from: number, to:number, step:number = 1){
    return Array(to - from + 1).fill(null)
    .map((_, i) => i+1);
}