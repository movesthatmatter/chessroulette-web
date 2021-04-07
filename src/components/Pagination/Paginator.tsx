import { useEffect, useState } from 'react';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { colors, softBorderRadius, text } from 'src/theme';
import { Text } from '../Text';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { range } from 'src/lib/util';

export type PaginatorProps = {
  totalPages: number;
  pageIndex: number;
  pageSize: number;
  onChangePage: (pageNumber: number) => void;
};

// type Page = {
//   display: string;
//   index: number;
//   isActive: boolean;
// }

const getNextPagerState = (props: Pick<PaginatorProps, 'totalPages' | 'pageIndex'>) => {
  const allPages = range(props.totalPages).map((_, index) => ({
    display: `${index + 1}`,
    isActive: props.pageIndex === index,
    index,

    // TODO: later on add the dots
  }));

  // TODO: This could be used in the future
  // const maxDisplayable = 5;
  // const onlyDisplayablePages =
  //   (allPages.length > maxDisplayable)
  //     ? [
  //         ...allPages.slice(0, 3),
  //         {
  //           display: '...',
  //           isActive: false,
  //           index: 3,
  //         } as const,
  //         ...allPages.slice(-2),
  //       ]
  //     : allPages;

  return {
    pages: allPages,
    totalPages: props.totalPages,
    currentPageIndex: props.pageIndex,
    hasNextPage: props.pageIndex < props.totalPages - 1,
    hasPrevPage: props.pageIndex > 0,
  } as const;
};

export const Paginator = (props: PaginatorProps) => {
  const cls = useStyles();

  const [pagerState, setPagerState] = useState(getNextPagerState(props));

  useEffect(() => {
    setPagerState(
      getNextPagerState({
        pageIndex: props.pageIndex,
        totalPages: props.totalPages,
      })
    );
  }, [props.pageIndex, props.totalPages]);

  return (
    <div className={cls.container}>
      <div className={cx(cls.paginationControlWrapper)}>
        <FontAwesomeIcon
          icon={faAngleLeft}
          size="lg"
          {...(pagerState.hasPrevPage
            ? {
                color: colors.primary,
                className: cls.clickable,
                onClick: () => props.onChangePage(props.pageIndex - 1),
              }
            : {
                color: colors.neutralDark,
              })}
        />
      </div>
      <div className={cls.pageNumbersWrapper}>
        {pagerState.pages.map((page) => (
          <div
            key={page.index}
            className={cx(cls.page, {
              [cls.activePage]: page.isActive,
            })}
          >
            <Text
              size="body1"
              className={cx(cls.pageNumber, {
                [cls.activePageNumber]: page.isActive,
                [cls.clickable]: !page.isActive,
              })}
              onClick={() => {
                if (!page.isActive) {
                  props.onChangePage(page.index);
                }
              }}
            >
              {page.display}
            </Text>
          </div>
        ))}
      </div>
      <div className={cx(cls.paginationControlWrapper)}>
        <FontAwesomeIcon
          icon={faAngleRight}
          size="lg"
          {...(pagerState.hasNextPage
            ? {
                color: colors.primary,
                className: cls.clickable,
                onClick: () => props.onChangePage(props.pageIndex + 1),
              }
            : {
                color: colors.neutralDark,
              })}
        />
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    alignContent: 'center',
  },
  clickable: {
    cursor: 'pointer',
  },
  paginationControlWrapper: {
    padding: '5px 0',
    alignContent: 'center',
  },
  pageNumbersWrapper: {
    display: 'flex',
    padding: '0 10px',
    alignContent: 'center',
  },

  page: {
    padding: '4px 12px',
  },
  activePage: {
    backgroundColor: colors.primary,
    ...softBorderRadius,
  },

  pageNumber: {
    color: text.disabledColor,
  },
  activePageNumber: {
    color: colors.white,
  },
});
