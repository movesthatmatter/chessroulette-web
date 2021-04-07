import { AsyncResult } from 'dstnd-io';
import { PaginatedResponse } from 'dstnd-io/dist/sdk/resource';
import React from 'react';
import { Paginator } from './Paginator';

type RenderProps<TItem> = {
  paginator: React.ReactNode;
  items: TItem[];
  pageIndex: number;
  totalPages: number;
  pageSize: number;
};

type Props<TItem> = {
  getItems: (pagination: {
    pageSize: number;
    pageIndex: number;
  }) => AsyncResult<PaginatedResponse<TItem>, unknown>;
  render: (p: RenderProps<TItem>) => React.ReactNode;

  initialPageSize?: number;
  initialPageIndex?: number;
};

type State<TItem> = {
  items: TItem[];
  pageIndex: number;
  pageSize: number;
  totalPages: number;
};

export class WithPagination<TItem> extends React.Component<Props<TItem>, State<TItem>> {
  constructor(props: Props<TItem>) {
    super(props);

    this.state = {
      items: [],
      pageIndex: props.initialPageIndex || 0,
      pageSize: props.initialPageSize || 10,
      totalPages: 1,
    };
  }

  componentDidMount() {
    this.getCurrentItems();
  }

  private getCurrentItems() {
    this.props.getItems({
      pageSize: this.state.pageSize,
      pageIndex: this.state.pageIndex,
    }).map((r) => {
      this.setState({
        items: r.items,
        totalPages: Math.ceil(r.itemsTotal / this.state.pageSize),
      })
    });
  }

  render() {
    const paginator = (
      <Paginator
        totalPages={this.state.totalPages}
        pageSize={this.state.pageSize}
        pageIndex={this.state.pageIndex}
        onChangePage={(nextPageIndex) => {
          this.setState({
            pageIndex: nextPageIndex,
          }, () => {
            this.getCurrentItems();
          });
        }}
      />
    );

    return this.props.render({
      paginator,
      items: this.state.items,
      pageIndex: this.state.pageIndex,
      totalPages: this.state.totalPages,
      pageSize: this.state.pageSize,
    });
  }
}
