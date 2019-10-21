/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { Fragment, useState, useMemo } from 'react'
import { withContainer, useDimensions, useTheme, SvgWrapper, CartesianMarkers } from '@nivo/core'
import { useInheritedColor } from '@nivo/colors'
import { Axes, Grid } from '@nivo/axes'
import { Brush, createBrushPointsFilter } from "@nivo/brush";
import { scaleTime, scaleLinear } from 'd3-scale'
import { area, curveMonotoneX } from 'd3-shape'
import { brushX } from 'd3-brush'
import { BoxLegendSvg } from '@nivo/legends'
import { Crosshair } from '@nivo/tooltip'
import { useLine } from './hooks'
import { LinePropTypes, LineDefaultProps } from './props'
import Areas from './Areas'
import Lines from './Lines'
import Slices from './Slices'
import Points from './LinePoints'
import Mesh from './Mesh'
import { computeXYScalesForSeries } from '@nivo/scales'

const CONTEXT_HEIGHT = 40;
const brushFilter = createBrushPointsFilter(p => [p.x, p.y]);

const getDataSlice = (data, { start, end } = { start: null, end: null }) => {
    if (start && end) {
        return data.map(({ data: d, ...rest }) => ({ ...rest, data: d.slice(start, end) }));
    }
    return data;
}

const Line = props => {
    const {
        data,
        xScale: xScaleSpec,
        xFormat,
        yScale: yScaleSpec,
        yFormat,
        layers,
        curve,
        areaBaselineValue,

        colors,

        margin: partialMargin,
        width,
        height,

        axisTop,
        axisRight,
        axisBottom,
        axisLeft,
        enableGridX,
        enableGridY,
        gridXValues,
        gridYValues,

        lineWidth,
        enableArea,
        areaOpacity,
        areaBlendMode,

        enablePoints,
        pointSymbol,
        pointSize,
        pointColor,
        pointBorderWidth,
        pointBorderColor,
        enablePointLabel,
        pointLabel,
        pointLabelFormat,
        pointLabelYOffset,

        markers,

        legends,

        isInteractive,

        useMesh,
        debugMesh,

        onMouseEnter,
        onMouseMove,
        onMouseLeave,
        onClick,

        tooltip,

        enableSlices,
        debugSlices,
        sliceTooltip,

        enableCrosshair,
        crosshairType,
    } = props

    const { margin, innerWidth, innerHeight, outerWidth, outerHeight } = useDimensions(
        width,
        height,
        partialMargin
    )
    const [dataSlice, setDataSlice] = useState({ selection: null, start: null, end: null });
    const { lineGenerator, areaGenerator, series, xScale, yScale, slices, points } = useLine({
        data: getDataSlice(data, dataSlice),
        xScale: xScaleSpec,
        xFormat,
        yScale: yScaleSpec,
        yFormat,
        width: innerWidth,
        height: innerHeight - CONTEXT_HEIGHT,
        colors,
        curve,
        areaBaselineValue,
        pointColor,
        pointBorderColor,
        enableSlices,
    })

    const { lineGenerator: brushLineGenerator,
        areaGenerator: brushAreaGenerator,
        series: brushSeries,
        xScale: brushXScale,
        yScale: brushYScale,
        slices: brushSlices,
        points: brushPoints } = useLine({
            data: data,
            xScale: xScaleSpec,
            xFormat,
            yScale: yScaleSpec,
            yFormat,
            width: innerWidth,
            height: innerHeight - CONTEXT_HEIGHT,
            colors,
            curve,
            areaBaselineValue,
            pointColor,
            pointBorderColor,
            enableSlices,
        })

    const theme = useTheme()
    const getPointColor = useInheritedColor(pointColor, theme)
    const getPointBorderColor = useInheritedColor(pointBorderColor, theme)

    const [currentPoint, setCurrentPoint] = useState(null)
    const [currentSlice, setCurrentSlice] = useState(null)

    const legendData = useMemo(
        () =>
            series
                .map(line => ({
                    id: line.id,
                    label: line.id,
                    color: line.color,
                }))
                .reverse(),
        [series]
    )

    const handleBrushEnd = selection => {
        const pointsInSelection = brushFilter(selection, points);
        if (pointsInSelection.length > 0) {
            setDataSlice({
                selection,
                start: (dataSlice.start || 0) + pointsInSelection[0].index,
                end: dataSlice.end
                    ? dataSlice.end - (points.length - pointsInSelection[pointsInSelection.length - 1].index)
                    : pointsInSelection[pointsInSelection.length - 1].index
            })
        }
    };

    const handleBrushEnd2 = selection => {
        const pointsInSelection = brushFilter(selection, brushPoints);

        console.log(selection);
        console.log(pointsInSelection);
        if (pointsInSelection.length > 0) {

            setDataSlice({
                selection,
                start: pointsInSelection[0].index,
                end: pointsInSelection[pointsInSelection.length - 1].index
            })
        }
    };

    const layerById = {
        grid: (
            <Grid
                key="grid"
                theme={theme}
                width={innerWidth}
                height={innerHeight - CONTEXT_HEIGHT}
                xScale={enableGridX ? xScale : null}
                yScale={enableGridY ? yScale : null}
                xValues={gridXValues}
                yValues={gridYValues}
            />
        ),
        markers: (
            <CartesianMarkers
                key="markers"
                markers={markers}
                width={innerWidth}
                height={innerHeight - CONTEXT_HEIGHT}
                xScale={xScale}
                yScale={yScale}
                theme={theme}
            />
        ),
        axes: (
            <Axes
                key="axes"
                xScale={xScale}
                yScale={yScale}
                width={innerWidth}
                height={innerHeight - CONTEXT_HEIGHT}
                theme={theme}
                top={axisTop}
                right={axisRight}
                bottom={axisBottom}
                left={axisLeft}
            />
        ),
        areas: null,
        lines: (
            <Lines key="lines" lines={series} lineGenerator={lineGenerator} lineWidth={lineWidth} />
        ),
        slices: null,
        points: null,
        crosshair: null,
        mesh: null,
        legends: legends.map((legend, i) => (
            <BoxLegendSvg
                key={`legend.${i}`}
                {...legend}
                containerWidth={innerWidth}
                containerHeight={innerHeight - CONTEXT_HEIGHT}
                data={legend.data || legendData}
                theme={theme}
            />
        )),
    }

    if (enableArea) {
        layerById.areas = (
            <Areas
                key="areas"
                areaGenerator={areaGenerator}
                areaOpacity={areaOpacity}
                areaBlendMode={areaBlendMode}
                lines={series}
            />
        )
    }

    if (isInteractive && enableSlices !== false) {
        layerById.slices = (
            <Slices
                key="slices"
                slices={slices}
                axis={enableSlices}
                debug={debugSlices}
                height={innerHeight - CONTEXT_HEIGHT}
                tooltip={sliceTooltip}
                current={currentSlice}
                setCurrent={setCurrentSlice}
            />
        )
    }

    if (enablePoints) {
        layerById.points = (
            <Points
                key="points"
                points={points}
                symbol={pointSymbol}
                size={pointSize}
                color={getPointColor}
                borderWidth={pointBorderWidth}
                borderColor={getPointBorderColor}
                enableLabel={enablePointLabel}
                label={pointLabel}
                labelFormat={pointLabelFormat}
                labelYOffset={pointLabelYOffset}
            />
        )
    }

    layerById.brush = (
        <Brush
            width={innerWidth}
            height={innerHeight - CONTEXT_HEIGHT}
            onBrushEnd={handleBrushEnd}
            fillColor="blue"
        />)


    const x2 = scaleLinear().domain([0, 100]).range([0, innerWidth]);
    const y2 = scaleLinear().domain([0, 10]).range([CONTEXT_HEIGHT, 0]);

    const area2 = area()
        .curve(curveMonotoneX)
        .x(d => x2(d.x))
        .y0(CONTEXT_HEIGHT)
        .y1(d => y2(d.y));

    function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || x2.range();
        x.domain(s.map(x2.invert, x2));
    }

    layerById.context = (
        <g className="context" style={{ transform: `translate(0, ${innerHeight}px)` }}>
            <path fill="steelblue" d={area2(data[0].data)}></path>
            <Axes
                key="axes"
                xScale={brushXScale}
                yScale={brushYScale}
                width={innerWidth}
                height={CONTEXT_HEIGHT}
                theme={theme}
                top={null}
                right={null}
                bottom={axisBottom}
                left={null}
            />
            <Brush
                width={innerWidth}
                height={CONTEXT_HEIGHT}
                onBrushEnd={handleBrushEnd2}
                showSelectionAlways={dataSlice.selection}
            />
        </g>
    )
    !layers.includes('brush') && layers.push('brush');
    !layers.includes('context') && layers.push('context');


    if (isInteractive && enableCrosshair) {
        if (currentPoint !== null) {
            layerById.crosshair = (
                <Crosshair
                    key="crosshair"
                    width={innerWidth}
                    height={innerHeight - CONTEXT_HEIGHT}
                    x={currentPoint.x}
                    y={currentPoint.y}
                    type={crosshairType}
                />
            )
        }
        if (currentSlice !== null) {
            layerById.crosshair = (
                <Crosshair
                    key="crosshair"
                    width={innerWidth}
                    height={innerHeight - CONTEXT_HEIGHT}
                    x={currentSlice.x}
                    y={currentSlice.y}
                    type={enableSlices}
                />
            )
        }
    }

    if (isInteractive && useMesh && enableSlices === false) {
        layerById.mesh = (
            <Mesh
                key="mesh"
                points={points}
                width={innerWidth}
                height={innerHeight - CONTEXT_HEIGHT}
                margin={margin}
                current={currentPoint}
                setCurrent={setCurrentPoint}
                onMouseEnter={onMouseEnter}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                tooltip={tooltip}
                debug={debugMesh}
            />
        )
    }

    return (
        <SvgWrapper width={outerWidth} height={outerHeight} margin={margin}>
            {layers.map((layer, i) => {
                if (typeof layer === 'function') {
                    return (
                        <Fragment key={i}>
                            {layer({
                                ...props,
                                innerWidth,
                                innerHeight: innerHeight - CONTEXT_HEIGHT,
                                series,
                                slices,
                                points,
                                xScale,
                                yScale,
                                lineGenerator,
                                areaGenerator,
                            })}
                        </Fragment>
                    )
                }

                return layerById[layer]
            })}
        </SvgWrapper>
    )
}

Line.propTypes = LinePropTypes
Line.defaultProps = LineDefaultProps

export default withContainer(Line)
