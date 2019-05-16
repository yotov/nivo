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
import { withContainer, useDimensions, useTheme, useMotionConfig } from '@nivo/core'
import { interpolateColor, getInterpolatedColor } from '@nivo/colors'
import { useTooltip } from '@nivo/tooltip'
import { TreeMapHtmlPropTypes, TreeMapHtmlDefaultProps } from './props'
import { getNodeHandlers } from './interactivity'
import { nodeWillEnter, nodeWillLeave } from './motion'
import { useTreeMap } from './hooks'

const TreeMapHtml = ({
    width,
    height,
    margin: partialMargin,

    root,
    identity,
    value,
    nodeComponent,

    tile,
    padding,
    leavesOnly,

    colors,
    colorBy,
    borderWidth,
    borderColor,

    labelTextColor,
    orientLabel,

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
    const { animate, springConfig } = useMotionConfig()
    const { showTooltipFromEvent, hideTooltip } = useTooltip()

    const { nodes } = useTreeMap({
        root,
        identity,
        value,
        width: innerWidth,
        height: innerHeight,
        tile,
        padding,
        leavesOnly,
        colors,
        colorBy,
        borderColor,
        labelTextColor,
    })

    const getHandlers = (node, showTooltip, hideTooltip) =>
        getNodeHandlers(node, {
            isInteractive,
            onClick,
            showTooltip,
            hideTooltip,
            theme,
            tooltipFormat,
            tooltip,
        })

    return (
        <div
            style={{
                position: 'relative',
                width: outerWidth,
                height: outerHeight,
            }}
        >
            {!animate && (
                <div style={{ position: 'absolute', top: margin.top, left: margin.left }}>
                    {nodes.map(node =>
                        React.createElement(nodeComponent, {
                            key: node.path,
                            node,
                            style: {
                                x: node.x,
                                y: node.y,
                                width: node.width,
                                height: node.height,
                                color: node.color,
                                borderWidth,
                                borderColor: node.style.borderColor,
                                labelTextColor: node.style.labelTextColor,
                                orientLabel,
                            },
                            handlers: getHandlers(node, showTooltipFromEvent, hideTooltip),
                        })
                    )}
                </div>
            )}
            {animate && (
                <TransitionMotion
                    willEnter={nodeWillEnter}
                    willLeave={nodeWillLeave(springConfig)}
                    styles={nodes.map(node => ({
                        key: node.path,
                        data: node,
                        style: {
                            x: spring(node.x, springConfig),
                            y: spring(node.y, springConfig),
                            width: spring(node.width, springConfig),
                            height: spring(node.height, springConfig),
                            ...interpolateColor(node.color, springConfig),
                        },
                    }))}
                >
                    {interpolatedStyles => (
                        <div
                            style={{
                                position: 'absolute',
                                top: margin.top,
                                left: margin.left,
                            }}
                        >
                            {interpolatedStyles.map(({ style, data: node }) => {
                                style.color = getInterpolatedColor(style)

                                return React.createElement(nodeComponent, {
                                    key: node.path,
                                    node,
                                    style: {
                                        ...style,
                                        fill: node.fill,
                                        borderWidth,
                                        borderColor: node.style.borderColor,
                                        labelTextColor: node.style.labelTextColor,
                                        orientLabel,
                                    },
                                    handlers: getHandlers(node, showTooltipFromEvent, hideTooltip),
                                })
                            })}
                        </div>
                    )}
                </TransitionMotion>
            )}
        </div>
    )
}

TreeMapHtml.propTypes = TreeMapHtmlPropTypes
TreeMapHtml.defaultProps = TreeMapHtmlDefaultProps

export default memo(withContainer(TreeMapHtml))
