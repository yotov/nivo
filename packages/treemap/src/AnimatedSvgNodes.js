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
import { useMotionConfig } from '@nivo/core'
import { interpolateColor, getInterpolatedColor } from '@nivo/colors'
import { nodeWillEnter, nodeWillLeave } from './motion'

const AnimatedSvgNodes = ({
    nodes,
    nodeComponent,
    padding,
    borderWidth,
    enableLabel,
    orientLabel,
    enableParentLabel,
    parentLabelSize,
    parentLabelPadding,
    isInteractive,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    onClick,
    tooltipFormat,
    tooltip,
}) => {
    const { springConfig } = useMotionConfig()

    return (
        <TransitionMotion
            willEnter={nodeWillEnter}
            willLeave={nodeWillLeave(springConfig)}
            styles={nodes.map(node => ({
                key: node.id,
                data: node,
                style: {
                    x: spring(node.box.x, springConfig),
                    y: spring(node.box.y, springConfig),
                    width: spring(node.box.width, springConfig),
                    height: spring(node.box.height, springConfig),
                    ...interpolateColor(node.style.color, springConfig),
                    labelRotation: spring(
                        orientLabel && node.box.height > node.box.width ? -90 : 0,
                        springConfig
                    ),
                },
            }))}
        >
            {interpolatedStyles => (
                <>
                    {interpolatedStyles.map(({ key, style, data: node }) => {
                        return React.createElement(nodeComponent, {
                            key,
                            node,
                            x: style.x,
                            y: style.y,
                            width: Math.max(style.width, 0),
                            height: Math.max(style.height, 0),
                            fill: getInterpolatedColor(style),
                            borderWidth,
                            padding,
                            enableParentLabel,
                            parentLabelSize,
                            parentLabelPadding,
                            enableLabel,
                            labelRotation: style.labelRotation,
                            handlers: {}, //getHandlers(node),
                        })
                    })}
                </>
            )}
        </TransitionMotion>
    )
}

AnimatedSvgNodes.propTypes = {}

export default memo(AnimatedSvgNodes)
