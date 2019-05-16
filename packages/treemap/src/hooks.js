/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { useMemo } from 'react'
import get from 'lodash/get'
import omit from 'lodash/omit'
import cloneDeep from 'lodash/cloneDeep'
import { treemap as d3Treemap, hierarchy } from 'd3-hierarchy'
import { treeMapTileFromProp, useTheme, useValueFormatter } from '@nivo/core'
import { useOrdinalColorScale, useInheritedColor } from '@nivo/colors'
import { TreeMapDefaultProps } from './props'

export const useTreeMapLayout = ({
    width,
    height,
    tile,
    padding,
    enableParentLabel,
    parentLabelSize,
}) =>
    useMemo(() => {
        const treemap = d3Treemap()
            .size([width, height])
            .tile(treeMapTileFromProp(tile))
            .round(true)
            .padding(padding)

        if (enableParentLabel) {
            const paddingTop = parentLabelSize + padding
            treemap.paddingTop(() => paddingTop)
        }

        return treemap
    }, [width, height, tile, padding, enableParentLabel, parentLabelSize])

export const useHierarchy = ({ root, getValue }) =>
    useMemo(() => hierarchy(root).sum(getValue), [root, getValue])

export const useAccessor = accessor =>
    useMemo(() => {
        if (typeof accessor === 'function') return accessor
        return d => get(d, accessor)
    }, [accessor])

const computeNodePath = (node, getIdentity) =>
    node
        .ancestors()
        .map(ancestor => getIdentity(ancestor.data))
        .join('.')

export const useTreeMap = ({
    root,
    identity = TreeMapDefaultProps.identity,
    name = TreeMapDefaultProps.name,
    value = TreeMapDefaultProps.value,
    valueFormat,
    leavesOnly = TreeMapDefaultProps.leavesOnly,
    width,
    height,
    tile = TreeMapDefaultProps.tile,
    padding = TreeMapDefaultProps.padding,
    label = TreeMapDefaultProps.label,
    enableParentLabel = TreeMapDefaultProps.enableParentLabel,
    parentLabel = TreeMapDefaultProps.parentLabel,
    parentLabelSize = TreeMapDefaultProps.parentLabelSize,
    colors = TreeMapDefaultProps.colors,
    colorBy = TreeMapDefaultProps.colorBy,
    borderColor = TreeMapDefaultProps.borderColor,
    labelTextColor = TreeMapDefaultProps.labelTextColor,
    parentLabelBackground = TreeMapDefaultProps.parentLabelBackground,
    parentLabelTextColor = TreeMapDefaultProps.parentLabelTextColor,
}) => {
    const getIdentity = useAccessor(identity)
    const getName = useAccessor(name)
    const getLabel = useAccessor(label)
    const getParentLabel = useAccessor(parentLabel)
    const getValue = useAccessor(value)
    const formatValue = useValueFormatter(valueFormat)

    const layout = useTreeMapLayout({
        width,
        height,
        tile,
        padding,
        enableParentLabel,
        parentLabelSize,
    })

    const hierarchy = useHierarchy({ root, getValue })
    const nodes = useMemo(() => {
        // d3 treemap mutates the data, so we need to copy it
        // to have proper behavior for subsequents useMemo()
        const rootCopy = cloneDeep(hierarchy)
        layout(rootCopy)

        const rawNodes = leavesOnly ? rootCopy.leaves() : rootCopy.descendants()

        return rawNodes.map(rawNode => {
            const id = computeNodePath(rawNode, getIdentity)
            const data = {
                ...omit(rawNode.data, 'children'),
                id: getIdentity(rawNode.data),
                name: getName(rawNode.data),
                value: rawNode.value,
                formattedValue: formatValue(rawNode.value),
                depth: rawNode.depth,
                height: rawNode.height,
            }
            if (enableParentLabel && data.height > 0) {
                data.label = getParentLabel(data)
            } else {
                data.label = getLabel(data)
            }

            const box = {
                x: rawNode.x0,
                y: rawNode.y0,
                width: rawNode.x1 - rawNode.x0,
                height: rawNode.y1 - rawNode.y0,
            }

            return { id, data, box }
        })
    }, [
        hierarchy,
        layout,
        leavesOnly,
        getIdentity,
        getName,
        getLabel,
        enableParentLabel,
        getParentLabel,
    ])

    const theme = useTheme()
    const getColor = useOrdinalColorScale(colors, colorBy)
    const getBorderColor = useInheritedColor(borderColor, theme)
    const getLabelTextColor = useInheritedColor(labelTextColor, theme)
    const getParentLabelBackground = useInheritedColor(parentLabelBackground, theme)
    const getParentLabelTextColor = useInheritedColor(parentLabelTextColor, theme)

    const nodesWithStyle = useMemo(
        () =>
            nodes.map(node => {
                node.style = {
                    color: getColor(node.data),
                }
                node.style.borderColor = getBorderColor(node)
                node.style.labelTextColor = getLabelTextColor(node)
                node.style.parentLabelBackground = getParentLabelBackground(node)
                node.style.parentLabelTextColor = getParentLabelTextColor(node)

                return node
            }),
        [
            nodes,
            getColor,
            getBorderColor,
            getLabelTextColor,
            getParentLabelBackground,
            getParentLabelTextColor,
        ]
    )

    return {
        root,
        hierarchy,
        nodes: nodesWithStyle,
        layout,
        getColor,
        getBorderColor,
        getLabelTextColor,
    }
}
