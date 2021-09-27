import React, { ReactNode } from 'react';
import { Text } from 'src/components/Text';

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
      <div style={{
        border: '1px solid #ececec',
      }}>
        {props.caption}
        <div>
          <div>
            {columns.map((key) => (
              <div key={String(key)} style={{alignContent:'center', alignItems:'center'}}>
                <Text><strong>{key}</strong></Text>
              </div>
            ))}
          </div>
        </div>
        <div>
          {props.data.map((datum) => (
            <div key={datum.id}>
              {columns.map((key) => (
                <div key={String(key)} style={{alignContent:'center', alignItems:'center'}}>
                  <Text>{props.columnsMap[key]?.format(datum) ?? datum[key]}</Text>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div>
          <div>
            {columns.map((key, index) => {
              return (
                <div key={String(key)} style={{alignContent:'center', alignItems:'center'}}>
                  {index < columns.length - 1 ? '' : <Text>{`Total ${props.data.length}`}</Text>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
