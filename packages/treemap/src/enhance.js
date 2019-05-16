/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { treemap as d3Treemap } from 'd3-hierarchy'
import cloneDeep from 'lodash/cloneDeep'
import compose from 'recompose/compose'
import defaultProps from 'recompose/defaultProps'
import withPropsOnChange from 'recompose/withPropsOnChange'
import {
    withHierarchy,
    getAccessorFor,
    getLabelGenerator,
    treeMapTileFromProp,
    bindDefs,
} from '@nivo/core'
import { getOrdinalColorScale, getInheritedColorGenerator } from '@nivo/colors'
import * as props from './props'

const computeNodePath = (node, getIdentity) =>
    node
        .ancestors()
        .map(ancestor => getIdentity(ancestor.data))
        .join('.')

const commonEnhancers = [
    withPropsOnChange(['label', 'labelFormat'], ({ label, labelFormat }) => ({
        getLabel: getLabelGenerator(label, labelFormat),
    })),
    withPropsOnChange(
        ['root', 'treemap', 'leavesOnly', 'getIdentity', 'getColor'],
        ({ root: _root, treemap, leavesOnly, getIdentity, getColor }) => {
            const root = cloneDeep(_root)

            treemap(root)

            let nodes = leavesOnly ? root.leaves() : root.descendants()
            nodes = nodes.map(d => {
                d.path = computeNodePath(d, getIdentity)

                d.nodeHeight = d.height

                d.x = d.x0
                d.y = d.y0
                d.width = d.x1 - d.x0
                d.height = d.y1 - d.y0
                d.data.color = d.color = getColor({ ...d.data, depth: d.depth })

                d.data.id = d.id = getIdentity(d.data)
                d.data.value = d.value

                return d
            })

            return { nodes }
        }
    ),
    withPropsOnChange(
        ['enableLabel', 'nodes', 'getLabel', 'labelSkipSize'],
        ({ enableLabel, nodes, getLabel, labelSkipSize }) => {
            if (!enableLabel) return

            const nodesWithLabel = nodes.map(node => {
                if (
                    node.nodeHeight > 0 ||
                    (labelSkipSize !== 0 && Math.min(node.width, node.height) <= labelSkipSize)
                )
                    return node
                return { ...node, label: getLabel(node.data) }
            })

            return { nodes: nodesWithLabel }
        }
    ),
]

const svgEnhancers = [
    withPropsOnChange(['nodes', 'defs', 'fill'], ({ nodes, defs, fill }) => {
        return {
            defs: bindDefs(defs, nodes, fill, { targetKey: 'fill' }),
        }
    }),
]

export default Component => {
    const implDefaultProps = props[`${Component.displayName}DefaultProps`]

    switch (Component.displayName) {
        case 'TreeMap':
            return compose(
                ...[defaultProps(implDefaultProps), ...commonEnhancers, ...svgEnhancers]
            )(Component)

        case 'TreeMapHtml':
            return compose(...[defaultProps(implDefaultProps), ...commonEnhancers])(Component)

        case 'TreeMapCanvas':
            return compose(...[defaultProps(implDefaultProps), ...commonEnhancers])(Component)
    }

    return Component
}
