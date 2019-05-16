/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { memo } from 'react'
import { TransitionMotion, spring } from 'react-motion'
import { withContainer, SvgWrapper, useDimensions, useTheme, useMotionConfig } from '@nivo/core'
import { interpolateColor, getInterpolatedColor } from '@nivo/colors'
import { useTooltip } from '@nivo/tooltip'
import { TreeMapPropTypes, TreeMapDefaultProps } from './props'
import { nodeWillEnter, nodeWillLeave } from './motion'
import { getNodeHandlers } from './interactivity'
import { useTreeMap } from './hooks'
import AnimatedSvgNodes from './AnimatedSvgNodes'

const TreeMap = ({
    width,
    height,
    margin: partialMargin,

    root,
    identity,
    name,
    value,
    valueFormat,

    tile,
    padding,
    leavesOnly,

    nodeComponent,
    colors,
    colorBy,
    borderWidth,
    borderColor,
    defs,

    enableLabel,
    label,
    labelSkipSize,
    labelTextColor,
    orientLabel,

    enableParentLabel,
    parentLabel,
    parentLabelSize,
    parentLabelPadding,
    parentLabelBackground,
    parentLabelTextColor,

    isInteractive,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    onClick,
    tooltipFormat,
    tooltip,
}) => {
    const theme = useTheme()
    const { margin, innerWidth, innerHeight, outerWidth, outerHeight } = useDimensions(
        width,
        height,
        partialMargin
    )
    const { animate } = useMotionConfig()
    const { showTooltipFromEvent, hideTooltip } = useTooltip()

    const { nodes } = useTreeMap({
        root,
        identity,
        name,
        value,
        valueFormat,
        width: innerWidth,
        height: innerHeight,
        tile,
        padding,
        enableParentLabel,
        parentLabel,
        label,
        parentLabelSize,
        leavesOnly,
        colors,
        colorBy,
        borderColor,
        labelTextColor,
        parentLabelBackground,
        parentLabelTextColor,
    })

    const getHandlers = node =>
        getNodeHandlers(node, {
            isInteractive,
            onClick,
            showTooltip: showTooltipFromEvent,
            hideTooltip,
            theme,
            tooltipFormat,
            tooltip,
        })

    return (
        <SvgWrapper width={outerWidth} height={outerHeight} margin={margin} defs={defs}>
            {!animate && (
                <>
                    {nodes.map(node =>
                        React.createElement(nodeComponent, {
                            key: node.path,
                            node,
                            style: {
                                fill: node.fill,
                                x: node.x0,
                                y: node.y0,
                                width: node.width,
                                height: node.height,
                                color: node.color,
                                borderWidth,
                                borderColor: node.style.borderColor,
                                labelTextColor: node.style.labelTextColor,
                                orientLabel,
                                enableParentLabel,
                                parentLabelSize,
                                parentLabelPadding,
                            },
                            handlers: getHandlers(node),
                        })
                    )}
                </>
            )}
            {animate && (
                <AnimatedSvgNodes
                    nodes={nodes}
                    nodeComponent={nodeComponent}
                    padding={padding}
                    borderWidth={borderWidth}
                    enableLabel={enableLabel}
                    labelSkipSize={labelSkipSize}
                    orientLabel={orientLabel}
                    enableParentLabel={enableParentLabel}
                    parentLabelSize={parentLabelSize}
                    parentLabelPadding={parentLabelPadding}
                />
            )}
        </SvgWrapper>
    )
}

TreeMap.propTypes = TreeMapPropTypes
TreeMap.defaultProps = TreeMapDefaultProps

export default memo(withContainer(TreeMap))
