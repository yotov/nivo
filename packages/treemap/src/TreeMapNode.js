/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@nivo/core'

const TreeMapNode = ({
    node,
    x,
    y,
    width,
    height,
    fill,
    borderWidth,
    padding,
    enableParentLabel,
    parentLabelSize,
    parentLabelPadding,
    enableLabel,
    labelRotation,
}) => {
    const theme = useTheme()
    if (node.box.width <= 0 || node.box.height <= 0) return null

    const shouldDisplayParentLabel =
        enableParentLabel && node.data.height > 0 && parentLabelSize + padding <= node.box.height
    const shouldDisplayLabel = enableLabel && node.data.height === 0

    return (
        <>
            <mask id={`${node.id}.mask`}>
                <rect width={width} height={height} fill="white" />
            </mask>
            <g transform={`translate(${x},${y})`} mask={`url(#${node.id}.mask)`}>
                <rect
                    width={800}
                    height={800}
                    fill={fill}
                    strokeWidth={borderWidth}
                    stroke={node.style.borderColor}
                />
                {shouldDisplayParentLabel && (
                    <>
                        <rect
                            x={0}
                            y={0}
                            width={width}
                            height={parentLabelSize}
                            fill={node.style.parentLabelBackground}
                            style={{ pointerEvents: 'none' }}
                        />
                        <text
                            x={parentLabelPadding}
                            y={parentLabelSize / 2}
                            textAnchor="start"
                            dominantBaseline="central"
                            style={{
                                ...theme.labels.text,
                                fill: node.style.parentLabelTextColor,
                                pointerEvents: 'none',
                            }}
                        >
                            {node.data.label}
                        </text>
                    </>
                )}
                {shouldDisplayLabel && (
                    <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{
                            ...theme.labels.text,
                            fill: node.style.labelTextColor,
                            pointerEvents: 'none',
                        }}
                        transform={`translate(${width / 2},${height / 2}) rotate(${labelRotation})`}
                    >
                        {node.data.label}
                    </text>
                )}
            </g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{ pointerEvents: 'none' }}
                fill="none"
                strokeWidth={borderWidth}
                stroke={node.style.borderColor}
            />
        </>
    )
}

TreeMapNode.propTypes = {
    node: PropTypes.shape({
        id: PropTypes.string.isRequired,
        data: PropTypes.shape({}).isRequired,
        box: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
        }).isRequired,
        style: PropTypes.shape({
            color: PropTypes.string.isRequired,
            borderColor: PropTypes.string.isRequired,
            labelTextColor: PropTypes.string.isRequired,
            parentLabelBackground: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    padding: PropTypes.number.isRequired,
    enableParentLabel: PropTypes.bool.isRequired,
    parentLabelSize: PropTypes.number.isRequired,
    parentLabelPadding: PropTypes.number.isRequired,
    enableLabel: PropTypes.bool.isRequired,
    labelSkipSize: PropTypes.number.isRequired,
    labelRotation: PropTypes.number.isRequired,
}

export default TreeMapNode
