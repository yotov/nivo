/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { spring } from 'react-motion'
import { interpolateColor } from '@nivo/colors'

export const nodeWillEnter = ({ data: node }) => ({
    x: node.box.x,
    y: node.box.y,
    width: node.box.width,
    height: node.box.height,
    ...interpolateColor(node.style.color),
    labelRotation: 0,
})

export const nodeWillLeave = springConfig => ({ data: node }) => ({
    x: spring(node.box.x + node.box.width / 2, springConfig),
    y: spring(node.box.y + node.box.height / 2, springConfig),
    width: spring(0, springConfig),
    height: spring(0, springConfig),
    ...interpolateColor(node.style.color, springConfig),
    labelRotation: spring(0, springConfig),
})
