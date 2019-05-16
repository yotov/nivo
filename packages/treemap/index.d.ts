/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { Component } from 'react'
import { Box, MotionProps, Dimensions, Theme } from '@nivo/core'
import { OrdinalColorsInstruction, InheritedColorProp } from '@nivo/colors'

declare module '@nivo/treemap' {
    export interface ComputedNode<Datum> {
        id: string
        data: {
            id: string
            name: string
            label: string | number
            value: number
            formattedValue: number | string
            depth: number
            height: number
        }
        box: {
            x: number
            y: number
            width: number
            height: number
        }
        style: {
            color: string
            borderColor: string
            labelTextColor: string
            parentLabelBackground: string
        }
    }

    type DatumAccessor<Datum, T> = (datum: Datum) => T
    type ComputedNodeAccessor<Datum, T> = (node: ComputedNode<Datum>) => T

    export type TreeMapMouseHandler<Datum> = (
        node: ComputedNode<Datum>,
        event: React.MouseEvent<any>
    ) => void

    type ValueFormatter<Datum> = (datum: Datum) => string | number

    interface CommonTreeMapProps<Datum> {
        data: Datum[]

        margin?: Box

        identity?: string | DatumAccessor<Datum, string>
        value?: string | DatumAccessor<Datum, number>
        valueFormat?: string | ValueFormatter<Datum>

        layers: any[]

        theme?: Theme
        colors?: OrdinalColorsInstruction
        colorBy?: string | ComputedNodeAccessor<Datum, string | number>
        borderWidth?: number | ComputedNodeAccessor<Datum, number>
        activeBorderWidth?: number | ComputedNodeAccessor<Datum, number>
        inactiveBorderWidth?: number | ComputedNodeAccessor<Datum, number>
        borderColor?: InheritedColorProp<ComputedNode<Datum>>

        isInteractive?: boolean
        onMouseEnter?: TreeMapMouseHandler<Datum>
        onMouseMove?: TreeMapMouseHandler<Datum>
        onMouseLeave?: TreeMapMouseHandler<Datum>
        onClick?: TreeMapMouseHandler<Datum>
        tooltip?: any
    }

    export interface TreeMapProps<Datum> extends CommonTreeMapProps<Datum>, MotionProps {}
    export class TreeMap<Datum> extends Component<TreeMapProps<Datum> & Dimensions> {}
    export class ResponsiveTreeMap<Datum> extends Component<TreeMapProps<Datum>> {}

    export interface TreeMapHtmlProps<Datum> extends CommonTreeMapProps<Datum>, MotionProps {}
    export class TreeMapHtml<Datum> extends Component<TreeMapHtmlProps<Datum> & Dimensions> {}
    export class ResponsiveTreeMapHtml<Datum> extends Component<TreeMapHtmlProps<Datum>> {}

    export interface TreeMapCanvasProps<Datum> extends CommonTreeMapProps<Datum> {
        pixelRatio?: number
    }
    export class TreeMapCanvas<Datum> extends Component<TreeMapCanvasProps<Datum> & Dimensions> {}
    export class ResponsiveTreeMapCanvas<Datum> extends Component<TreeMapCanvasProps<Datum>> {}
}
