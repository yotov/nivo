/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React from 'react'
import omit from 'lodash/omit'
import { ResponsiveTreeMap, TreeMapDefaultProps } from '@nivo/treemap'
import ComponentTemplate from '../../components/components/ComponentTemplate'
import meta from '../../data/components/treemap/meta.yml'
import mapper from '../../data/components/treemap/mapper'
import { groups } from '../../data/components/treemap/props'
import { generateLightDataSet } from '../../data/components/treemap/generator'

const initialProperties = {
    identity: 'name',
    name: 'name',
    value: 'loc',
    valueFormat: '.02s',
    tile: TreeMapDefaultProps.tile,
    leavesOnly: TreeMapDefaultProps.leavesOnly,
    padding: 3,

    margin: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
    },

    enableLabel: TreeMapDefaultProps.enableLabel,
    label: 'formattedValue',
    labelSkipSize: 12,
    labelTextColor: TreeMapDefaultProps.labelTextColor,
    orientLabel: TreeMapDefaultProps.orientLabel,

    enableParentLabel: TreeMapDefaultProps.enableParentLabel,
    parentLabel: TreeMapDefaultProps.parentLabel,
    parentLabelSize: TreeMapDefaultProps.parentLabelSize,
    parentLabelPadding: TreeMapDefaultProps.parentLabelPadding,
    parentLabelBackground: TreeMapDefaultProps.parentLabelBackground,
    parentLabelTextColor: TreeMapDefaultProps.parentLabelTextColor,

    colors: TreeMapDefaultProps.colors,
    colorBy: TreeMapDefaultProps.colorBy,
    borderWidth: TreeMapDefaultProps.borderWidth,
    activeBorderWidth: TreeMapDefaultProps.activeBorderWidth,
    inactiveBorderWidth: TreeMapDefaultProps.inactiveBorderWidth,
    borderColor: TreeMapDefaultProps.borderColor,

    isInteractive: TreeMapDefaultProps.isInteractive,

    animate: TreeMapDefaultProps.animate,
    motionStiffness: TreeMapDefaultProps.motionStiffness,
    motionDamping: TreeMapDefaultProps.motionDamping,
}

const TreeMap = () => {
    return (
        <ComponentTemplate
            name="TreeMap"
            meta={meta.TreeMap}
            icon="treemap"
            flavors={meta.flavors}
            currentFlavor="svg"
            properties={groups}
            initialProperties={initialProperties}
            defaultProperties={TreeMapDefaultProps}
            propertiesMapper={mapper}
            generateData={generateLightDataSet}
            dataKey="root"
        >
            {(properties, data, theme, logAction) => {
                return (
                    <ResponsiveTreeMap
                        root={data.root}
                        {...properties}
                        theme={theme}
                        onClick={node => {
                            logAction({
                                type: 'click',
                                label: `[node] ${node.data.name}: ${node.data.formattedValue}`,
                                color: node.style.color,
                                data: node,
                            })
                        }}
                    />
                )
            }}
        </ComponentTemplate>
    )
}

export default TreeMap
