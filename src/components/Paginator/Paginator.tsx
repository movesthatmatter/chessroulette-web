import { useEffect, useState } from 'react';
import React from 'react';
import {Game} from '../../modules/Games/types';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { borderRadius, colors, floatingShadow } from 'src/theme';

type Props = {
  totalPages : number;
  pageSize: number;
  onChangePage : (pageNumber : number) => void;
};
export const Paginator = ({ 
    totalPages,
    pageSize = 5,
    onChangePage
}: Props) => {

  const cls = useStyles();
  const [pager, setPager] = useState({
      pages : [1],
      totalPages : 1,
      startPage: 1,
      endPage : 1,
      currentPage : 1,
  });

  useEffect(() => {
    if (totalPages > 0){
        setPage(1)
    }
  },[totalPages])

  const setPage = (page : number) => {
      if (page < 1 || page > pager.totalPages){
          return;
      }
      const updatedPager = getPager(page);
      setPager(updatedPager);
      onChangePage(updatedPager.currentPage);
  }
  
  const getPager = (currentPage : number) => {
    let startPage : number, endPage : number;
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
    const pages = createRange(startPage, endPage);
    return {pages, totalPages, startPage, endPage, currentPage}
  }
  
  /* if (!pager.pages || pager.pages.length <= 1){
      return null;
  } */
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
      color:colors.white,
      backgroundColor: colors.primary
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