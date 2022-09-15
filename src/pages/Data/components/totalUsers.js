import React, {useState } from 'react';
import { Table, Col,  } from 'antd';
import { G2, } from '@ant-design/charts';
import { ChoroplethMap } from '@ant-design/maps';

const TotalUsers = (props => {
    const { data, total_num } = props;
    const G = G2.getEngine('canvas');

    const config = {
        map: {
            type: 'mapbox',
            style: 'blank',
            center: [120.19382669582967, 30.258134],
            zoom: 3,
            pitch: 0,
        },
        source: {
            data: data,
            joinBy: {
                sourceField: 'adcode',
                geoField: 'adcode',
            },
        },
        viewLevel: {
            level: 'country',
            adcode: 100000,
        },
        autoFit: true,
        color: {
        field: 'value',
        value: ['#d9f7be', '#95de64', '#52c41a', '#237804'],
        scale: {
            type: 'quantile',
        },
        },
        style: {
            opacity: 1,
            stroke: '#ccc',
            lineWidth: 0.6,
            lineOpacity: 1,
        },
        label: {
            visible: true,
            field: 'name',
            style: {
                fill: '#000',
                opacity: 0.8,
                fontSize: 10,
                stroke: '#fff',
                strokeWidth: 1.5,
                textAllowOverlap: false,
                padding: [5, 5],
            },
        },
        state: {
            active: {
                stroke: 'black',
                lineWidth: 1,
            },
        },
        tooltip: {
            items: ['name', 'value'],
        },
        zoom: {
            position: 'bottomright',
        },
        legend: {
            position: 'bottomleft',
        },
    };
  
  
    return (
        <div>
            <h2 style={{textAlign: 'center'}}>{total_num}</h2>
            <Col style={{height: '470px'}}>           
                <ChoroplethMap {...config}/>
            </Col> 
        </div>
           
    )
});

export default TotalUsers;
