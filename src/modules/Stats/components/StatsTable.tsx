import React, { ReactNode } from 'react';
import {
  Table as GTable,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
  Text,
} from 'grommet';

type Props<T extends object> = {
  caption: string;
  columnsMap: Partial<Record<keyof T, null | { format: (item: T) => ReactNode }>>;
  data: (T & { id: string })[];
};

export class StatsTable<T extends object> extends React.Component<Props<T>> {
  render() {
    const props = this.props;

    const columns = Object.keys(props.columnsMap) as (keyof typeof props.columnsMap)[];

    return (
      <GTable caption={props.caption} style={{
        border: '1px solid #ececec',
      }}>
        <TableHeader>
          <TableRow>
            {columns.map((key) => (
              <TableCell key={String(key)} scope="col" align="center">
                <Text><strong>{key}</strong></Text>
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.data.map((datum) => (
            <TableRow key={datum.id}>
              {columns.map((key) => (
                <TableCell key={String(key)} align="center">
                  <Text>{props.columnsMap[key]?.format(datum) ?? datum[key]}</Text>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            {columns.map((key, index) => {
              return (
                <TableCell key={String(key)} align={'right' as 'center'}>
                  {index < columns.length - 1 ? '' : <Text>{`Total ${props.data.length}`}</Text>}
                </TableCell>
              );
            })}
          </TableRow>
        </TableFooter>
      </GTable>
    );
  }
}
