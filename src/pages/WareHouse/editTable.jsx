/* eslint-disable camelcase */
import React, { useState } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Row, Form, Col, Input, Select } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const EditForm = Form.create()(props => {
  const { form, dispatch, result, flag, bill_sid, loading } = props;
  const { getFieldDecorator } = form;
  const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const [covers, setCovers] = useState(result.doc.covers);
  const [selected, setSelected] = useState(result.doc.selected);
  const [imageSize, setImageSize] = useState({});
  const [movedPicIndex, setMovedPicIndex] = useState(-1);
  // 反转key:vlaue, from baidu
  const invertKeyValues = obj =>
    Object.keys(obj).reduce((acc, key) => {
      acc[obj[key]] = key;
      return acc;
    }, {});
  const image_colors = result.doc.sku_images ? invertKeyValues(result.doc.sku_images) : {};

  let edited = '';
  selected.map(s => {
    edited = edited + '<img src="' + s + '">';
  });

  const columns = [
    {
      title: '颜色',
      dataIndex: 'specifications[0]',
    },
    {
      title: '型号',
      dataIndex: 'specifications[1]',
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
    {
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '原价',
      dataIndex: 'oriPrice',
    },
  ];

  const setMasonry = src => {
    if (selected.indexOf(src) > -1) {
      const new_selected = selected.filter(ret => ret !== src);
      setSelected(new_selected);
    } else {
      const new_selected = [...selected, src];
      setSelected(new_selected);
    }
  };

  const setCover = src => {
    const new_covers = [...covers, src];
    setCovers(new_covers);
  };
  const unsetCover = src => {
    const new_covers = covers.filter(ret => ret !== src);
    setCovers(new_covers);
  };

  const onSubmit = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // console.log(fieldsValue);
      const { tags } = fieldsValue;
      dispatch({
        type: 'warehouse/editSubmit',
        payload: { ...fieldsValue, bill_sid, tag_ids: tags.toString() },
      });
    });
  };

  const onNext = () => {
    dispatch({
      type: 'warehouse/next',
      payload: { bill_sid, f: 'json' },
    });
    setCovers([]);
    setSelected([]);
  };
  // 加载图片时获取图片尺寸
  const loadImageInfo = src => {
    const img = new Image();
    img.src = src;
    const info = '图片大小：' + img.width + ' x ' + img.height;
    // console.log(info)
    imageSize[src] = info;
    setImageSize(imageSize);
    setCovers(result.doc.covers);
    setSelected(result.doc.selected);
  };

  const onReset = () => {
    dispatch({
      type: 'warehouse/reset',
      payload: { reset: 'true', pro_md5: result.doc.pro_md5 },
    });
  };
  // 实现拖动图片改变顺序功能
  const dragStart = index => {
    setMovedPicIndex(index);
  };
  const allowDrop = e => {
    e.preventDefault(); // 设置允许放置图片，默认不允许的
  };
  const swapPic = (fromIndex, toIndex) => {
    const picData = [...covers];
    [picData[fromIndex], picData[toIndex]] = [picData[toIndex], picData[fromIndex]];
    // console.log(picData);
    return picData;
  };
  const drop = (index, e) => {
    e.preventDefault();
    const picData = swapPic(movedPicIndex, index);
    setCovers(picData);
  };

  return (
    <Form layout="inline" style={{ padding: '20px 30px 20px' }}>
      <Form.Item label="标题">
        {getFieldDecorator('title', {
          initialValue: result && result.doc ? result.doc.title : undefined,
        })(<Input />)}
      </Form.Item>
      <Row gutter={{ md: 20, lg: 60, xl: 120 }}>
        <Col md={8} sm={24}>
          <Form.Item label="物料号">
            {getFieldDecorator('pro_md5', {
              initialValue: result.doc ? result.doc.pro_md5 : undefined,
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <Form.Item label="SKU">
            {getFieldDecorator('gen_sku', {
              initialValue: result.doc ? result.doc.supply_title + '/' + result.doc.sku : undefined,
            })(<Input />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={{ md: 20, lg: 60, xl: 120 }}>
        <Col md={8} sm={24}>
          <Form.Item label="原价">
            {getFieldDecorator('origin_price', {
              initialValue: result && result.doc ? result.doc.origin_price : undefined,
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <Form.Item label="当前价">
            {getFieldDecorator('current_price', {
              initialValue: result && result.doc ? result.doc.current_price : undefined,
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <Form.Item label="售价">
            {getFieldDecorator('sold_price', {
              initialValue: result && result.doc ? result.doc.sold_price : undefined,
            })(<Input />)}
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Tags">
        {getFieldDecorator('tags', {
          initialValue: result.doc.tag_ids,
        })(
          <Select
            showSearch
            showArrow
            style={{ width: '100%' }}
            mode="tags"
            optionFilterProp="label"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {Object.entries(result.tags).map(item => (
              <Select.Option key={item[1]} value={item[0].toString()} label={item[1]}>
                {item[1]}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      {result && result.doc && result.doc.products && (
        <Table columns={columns} dataSource={result.doc.products} pagination={false} bordered />
      )}
      <div>
        <div style={{ width: '100%', height: '400px', overflowY: 'scroll' }}>
          <div className={styles.editor}>
            {selected.map(src => (
              <img src={src} alt="" onDoubleClick={() => setMasonry(src)} />
            ))}
          </div>
        </div>
        <Form.Item>
          {getFieldDecorator('edited', {
            initialValue: edited,
          })(<Input type="hidden" />)}
        </Form.Item>
      </div>
      <Row>
        <Button
          type="primary"
          style={{ padding: '0 30px', marginRight: '30px' }}
          onClick={onSubmit}
          loading={loading.effects['warehouse/editSubmit']}
        >
          保存
        </Button>
        <Button type="danger" style={{ padding: '0 30px', marginRight: '30px' }} onClick={onReset}>
          清除同步信息
        </Button>
        <Button
          style={{ padding: '0 30px', marginRight: '30px' }}
          onClick={() => {
            dispatch(
              routerRedux.push({
                pathname: `/good/item`,
              }),
            );
          }}
        >
          返回订单详情
        </Button>
        {flag && (
          <Button
            style={{ background: '#009688', padding: '0 30px', color: '#fff', marginRight: '30px' }}
            onClick={onNext}
          >
            下一个
          </Button>
        )}
      </Row>
      <div className={styles.covers}>
        <p style={{ padding: '10px 0' }}>封面图片，拖动可调整次序，再次点击可删除</p>
        {nums.map((i, index) => (
          <div
            draggable="true"
            onDragStart={e => dragStart(index, e)}
            onDragOver={allowDrop}
            onDrop={e => drop(index, e)}
          >
            <img
              src={
                covers && covers[i] !== undefined && i < covers.length
                  ? covers[i]
                  : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKIAAACgBAMAAAB9FKojAAAAHlBMVEX///+IiIi0tLSZmZnu7u7d3d3MzMy7u7uqqqqYmJiTAwdvAAAA/0lEQVRo3u3aMQrCMBQG4ICIqw9EHNUTqD2B0AO45AAumd0yu3XVExveYKEZWn0p5CX/P/10+JbyQtrEIFWFOKGsuGxDu3I7hfbkdjNmyWUXHi24bUK7c3t8jdpFkyQQIYpEBBHH+1SOppmBCLFs0Tkh1TuI/hyI9mZ62lYmxg5RGpEIIkSI/4lNIxZjRy5yINYndp1M7B1NUwgRYtmitVJx3DkO8yJ6D5/9tLzRlKwhzi1aO/quz0SX6F3HjqaZgQixbDHdbk/THhdirmK6r2FNUwgRYtliur/XmlYzJK8TL+c0nRdChFi26H1eN2aQuqNhZiDWJGq4e52/iNSRD3b4gnSGwV+SAAAAAElFTkSuQmCC'
              }
              alt=""
              onClick={() => unsetCover(covers[i])}
            />
            <Form.Item>
              {getFieldDecorator('cover' + i, {
                initialValue: covers && i < covers.length ? covers[i] : undefined,
              })(<Input type="hidden" />)}
            </Form.Item>
          </div>
        ))}
      </div>
      {result && result.doc && result.doc.images && (
        <div style={{ marginTop: '20px' }} className={styles.masonry}>
          {result.doc.images.map(src => (
            <div style={{ padding: '5px', display: 'inline-block' }}>
              <div
                className={styles.images}
                style={{
                  border: selected.indexOf(src) > -1 ? '1px solid #d48181' : 'none',
                }}
              >
                <img
                  src={src}
                  alt=""
                  onClick={() => setMasonry(src)}
                  onLoad={() => loadImageInfo(src)}
                />
                <div style={{ lineHeight: '40px', fontWeight: 600 }}> {imageSize[src]} </div>
                {result && result.doc.color && result.doc.color[src] && (
                  <div style={{ color: 'red', fontWeight: 900 }}>{result.doc.color[src]}</div>
                )}
                {covers && covers.indexOf(src) > -1 ? (
                  <Button type="danger" style={{ margin: ' 10px' }} onClick={() => unsetCover(src)}>
                    取消设置封面
                  </Button>
                ) : (
                  <Button type="primary" style={{ margin: ' 10px' }} onClick={() => setCover(src)}>
                    设置为封面图
                  </Button>
                )}
                {result.doc && result.doc.colors && (
                  <Select
                    showSearch
                    allowClear
                    placeholder="请选择一个颜色"
                    defaultValue={image_colors[src]}
                    onChange={color => {
                      dispatch({
                        type: 'warehouse/editSubmit',
                        payload: {
                          sku_image: src,
                          color,
                          bill_sid,
                          f: 'json',
                          pro_md5: result.doc.pro_md5,
                        },
                      });
                    }}
                  >
                    {result.doc.colors.map(item => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Form>
  );
});

function EditTable({ warehouse, dispatch, loading }) {
  const { result, flag, bill_sid } = warehouse;

  return (
    <Card>
      <div className={styles.tableListForm}>
        <EditForm
          dispatch={dispatch}
          result={result}
          flag={flag}
          bill_sid={bill_sid}
          loading={loading}
        />
      </div>
    </Card>
  );
}

export default connect(({ warehouse, dispatch, loading }) => ({ warehouse, dispatch, loading }))(
  EditTable,
);
