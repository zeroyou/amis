import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode, PlainObject} from '../types';
import {filter} from '../utils/tpl';
import cx from 'classnames';
import {BaseSchema, SchemaTpl} from '../Schema';

/**
 * Mapping 映射展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/mapping
 */
export interface MappingSchema extends BaseSchema {
  type: 'map' | 'mapping';

  /**
   * 关联字段名。
   */
  name?: string;

  map?: {
    '*': SchemaTpl;
    [propName: string]: SchemaTpl;
  };

  /**
   * 占位符
   */
  placeholder?: string;
}

export interface MappingProps extends RendererProps, MappingSchema {}

export class MappingField extends React.Component<MappingProps, object> {
  static defaultProps: Partial<MappingProps> = {
    placeholder: '-',
    map: {
      '*': '通配值'
    }
  };

  render() {
    const {className, placeholder, map, render, classnames: cx} = this.props;
    let key = this.props.value;

    let viewValue: React.ReactNode = (
      <span className="text-muted">{placeholder}</span>
    );

    key = typeof key === 'string' ? key.trim() : key; // trim 一下，干掉一些空白字符。

    if (typeof key !== 'undefined' && map && (map[key] ?? map['*'])) {
      viewValue = render(
        'tpl',
        map[key] ??
          (key === true && map['1']
            ? map['1']
            : key === false && map['0']
            ? map['0']
            : map['*']) // 兼容平台旧用法：即 value 为 true 时映射 1 ，为 false 时映射 0
      );
    }

    return <span className={cx('MappingField', className)}>{viewValue}</span>;
  }
}

@Renderer({
  test: /(^|\/)(?:map|mapping)$/,
  name: 'mapping'
})
export class MappingFieldRenderer extends MappingField {}
