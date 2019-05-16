/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { TreeMapDefaultProps } from '@nivo/treemap'
import { motionProperties, defsProperties, groupProperties } from '../../../lib/componentProperties'

const defaults = TreeMapDefaultProps

const props = [
    {
        key: 'root',
        group: 'Base',
        type: 'object',
        required: true,
        help: 'The hierarchical data object.',
        description: `
            This object should contain nested nodes
            using the \`children\` property.
            Identity, name and value is defined
            by the corresponding props.

            For example, if you use the default \`identity\`,
            \`name\` and \`value\`, this object should look
            like this:

            \`\`\`
            {
                id: 'root',
                children: [
                    { id: 'A', value: 7 },
                    { id: 'B', value: 9 },
                    {
                        id: 'C',
                        children: [
                            { id: 'C.0', value: 3 },
                            { id: 'C.1', value: 5 },
                        ]
                    },
                ]
            }
            \`\`\`
        `,
    },
    {
        key: 'identity',
        group: 'Base',
        type: 'string | Function',
        help: 'The key or function to use to retrieve nodes identity.',
        defaultValue: defaults.identity,
    },
    {
        key: 'name',
        group: 'Base',
        type: 'string | Function',
        help: 'The key or function to use to retrieve nodes name.',
        defaultValue: defaults.name,
    },
    {
        key: 'value',
        group: 'Base',
        type: 'string | Function',
        help: 'The key or function to use to retrieve nodes value.',
        defaultValue: defaults.value,
    },
    {
        key: 'valueFormat',
        group: 'Base',
        type: 'string | (value: number) => string | number',
        help: `Optional value formatter.`,
        description: `
            The formatted value can be used for labels and tooltip.

            You can use a custom function which will receive the node's value.
            You can also use a format specifier supported
            by [d3-format](https://github.com/d3/d3-format#locale_format).
        `,
    },
    {
        key: 'tile',
        group: 'Base',
        type: 'string',
        help: 'Strategy used to compute nodes.',
        description: `
            Strategy used to compute nodes, see
            [official d3 documentation](https://github.com/mbostock/d3/wiki/Treemap-Layout#mode).
        `,
        defaultValue: defaults.tile,
        controlType: 'choices',
        controlOptions: {
            choices: [
                { label: 'binary', value: 'binary' },
                { label: 'squarify', value: 'squarify' },
                { label: 'slice', value: 'slice' },
                { label: 'dice', value: 'dice' },
                { label: 'sliceDice', value: 'sliceDice' },
                {
                    label: 'resquarify',
                    value: 'resquarify',
                },
            ],
        },
    },
    {
        key: 'leavesOnly',
        help: 'Only render leaf nodes (no parent).',
        type: 'boolean',
        required: false,
        defaultValue: defaults.leavesOnly,
        controlType: 'switch',
        group: 'Base',
    },
    {
        key: 'padding',
        help: 'Padding between nodes.',
        type: 'number',
        required: false,
        defaultValue: defaults.padding,
        controlType: 'range',
        group: 'Base',
        controlOptions: {
            unit: 'px',
            min: 0,
            max: 32,
        },
    },
    {
        key: 'width',
        group: 'Base',
        enableControlForFlavors: ['api'],
        help: 'Chart width.',
        description: `
            not required if using responsive alternative
            of the component \`<Responsive*/>\`.
        `,
        type: 'number',
        required: true,
    },
    {
        key: 'height',
        group: 'Base',
        enableControlForFlavors: ['api'],
        help: 'Chart height.',
        description: `
            not required if using responsive alternative
            of the component \`<Responsive*/>\`.
        `,
        type: 'number',
        required: true,
    },
    {
        key: 'pixelRatio',
        group: 'Base',
        flavors: ['canvas'],
        help: `Adjust pixel ratio, useful for HiDPI screens.`,
        required: false,
        defaultValue: 'Depends on device',
        type: `number`,
        controlType: 'range',
        group: 'Base',
        controlOptions: {
            min: 1,
            max: 2,
        },
    },
    {
        key: 'margin',
        group: 'Base',
        type: 'object',
        help: 'Chart margin.',
        controlType: 'margin',
    },
    {
        key: 'colors',
        group: 'Style',
        type: 'object | string | string[] | (node: Node) => string',
        help: 'Defines how to compute node color.',
        defaultValue: defaults.colors,
        controlType: 'ordinalColors',
    },
    {
        key: 'colorBy',
        group: 'Style',
        type: 'string | Function',
        help: `define the property to use to define node color.`,
        defaultValue: defaults.colorBy,
    },
    {
        group: 'Style',
        key: 'borderWidth',
        type: 'number',
        help: 'Node border width.',
        defaultValue: defaults.borderWidth,
        controlType: 'lineWidth',
    },
    {
        key: 'activeBorderWidth',
        group: 'Style',
        type: 'number',
        help: 'Node border width for active nodes.',
        defaultValue: defaults.activeBorderWidth,
        controlType: 'lineWidth',
    },
    {
        key: 'inactiveBorderWidth',
        group: 'Style',
        type: 'number',
        help: 'Node border width for inactive nodes.',
        defaultValue: defaults.inactiveBorderWidth,
        controlType: 'lineWidth',
    },
    {
        key: 'borderColor',
        group: 'Style',
        type: 'string | object | Function',
        help: 'Method to compute border color.',
        defaultValue: defaults.borderColor,
        controlType: 'inheritedColor',
        controlOptions: {
            inheritableProperties: ['style.color', 'data.color'],
        },
    },
    ...defsProperties('Style', ['svg']),
    {
        key: 'enableLabel',
        help: 'Enable/disable labels.',
        type: 'boolean',
        defaultValue: defaults.enableLabel,
        controlType: 'switch',
        group: 'Labels',
    },
    {
        key: 'label',
        group: 'Labels',
        type: 'string | (node: Node) => string',
        help: 'Label accessor.',
        description: `
            Defines how to get label text, can be a string
            (used to access current node data property)
            or a function which will receive the actual node data
            and must return the desired label.
        `,
        defaultValue: defaults.label,
        controlType: 'choices',
        controlOptions: {
            choices: [
                'value',
                'formattedValue',
                'name',
                `n => \`\${n.name} (\${n.formattedValue})\``,
            ].map(prop => ({
                label: prop,
                value: prop,
            })),
        },
    },
    {
        key: 'labelSkipSize',
        help:
            'Skip label rendering if node minimal side length is lower than given value, 0 to disable.',
        type: 'number',
        required: false,
        controlType: 'range',
        group: 'Labels',
        controlOptions: {
            unit: 'px',
            min: 0,
            max: 100,
        },
    },
    {
        key: 'orientLabel',
        help: 'Orient labels according to max node width/height.',
        type: 'boolean',
        controlType: 'switch',
        group: 'Labels',
    },
    {
        key: 'labelTextColor',
        group: 'Labels',
        type: 'string | object | (node: Node) => string',
        help: 'Method to compute label text color.',
        controlType: 'inheritedColor',
        defaultValue: defaults.labelTextColor,
        controlOptions: {
            inheritableProperties: ['style.color', 'data.color'],
        },
    },
    {
        key: 'enableParentLabel',
        group: 'Parent Labels',
        type: 'boolean',
        help: 'Enable/disable parent labels.',
        description: `
            Please note that even if this property is \`true\`,
            if there's not enough space to show the label,
            it might be skipped.
        `,
        defaultValue: defaults.enableParentLabel,
        controlType: 'switch',
    },
    {
        key: 'parentLabel',
        group: 'Parent Labels',
        type: 'string | (node: Node) => string',
        help: 'Parent label accessor.',
        description: `
            Defines how to get parent label text, can be a string
            (used to access current node data property)
            or a function which will receive the actual node data
            and must return the desired label.
        `,
        defaultValue: defaults.parentLabel,
        controlType: 'choices',
        controlOptions: {
            choices: [
                'value',
                'formattedValue',
                'name',
                `n => \`\${n.name} (\${n.formattedValue})\``,
            ].map(prop => ({
                label: prop,
                value: prop,
            })),
        },
    },
    {
        key: 'parentLabelSize',
        group: 'Parent Labels',
        type: 'number',
        help: 'Parent label container size.',
        defaultValue: defaults.parentLabelSize,
        controlType: 'range',
        controlOptions: {
            unit: 'px',
            min: 12,
            max: 36,
        },
    },
    {
        key: 'parentLabelPadding',
        group: 'Parent Labels',
        type: 'number',
        help: 'Parent label inner padding.',
        defaultValue: defaults.parentLabelPadding,
        controlType: 'range',
        controlOptions: {
            unit: 'px',
            min: 0,
            max: 24,
        },
    },
    {
        key: 'parentLabelBackground',
        type: 'string | object | Function',
        group: 'Parent Labels',
        help: 'Method to compute parent label background color.',
        defaultValue: defaults.parentLabelBackground,
        controlType: 'inheritedColor',
        controlOptions: {
            inheritableProperties: ['style.color', 'data.color'],
        },
    },
    {
        key: 'parentLabelTextColor',
        group: 'Parent Labels',
        type: 'string | object | (node: Node) => string',
        help: 'Method to compute parent label text color.',
        controlType: 'inheritedColor',
        defaultValue: defaults.parentLabelTextColor,
        controlOptions: {
            inheritableProperties: ['style.color', 'data.color'],
        },
    },
    {
        key: 'layers',
        group: 'Customization',
        flavors: ['svg', 'html', 'canvas'],
        type: '(props) => ReactNode | (ctx, props) => void',
        help: 'Add extra layers.',
        description: `
            You can insert extra layers using this property.
            
            You must return a valid SVG element for TreeMap,
            a valid HTML element for TreeMapHtml, if you're
            using TreeMapCanvas, you'll receive the canvas
            2d context and the props.
        `,
    },
    {
        key: 'nodeComponent',
        group: 'Customization',
        flavors: ['svg', 'html'],
        type: 'Component',
        help: 'Override default node component.',
        description: `
            The component must return a valid SVG element
            for TreeMap and a valid HTML one for TreeMapHtml.

            Please note that the default component also 
            handle the rendering of parent label, if You
            want to support it you'll have to implement it
            by yourself.

            The best way to see which properties are availabe
            is to \`console.log(props)\` inside your custom
            component or have a look at the default one.
        `,
    },
    {
        key: 'isInteractive',
        flavors: ['svg', 'html', 'canvas'],
        help: 'Enable/disable interactivity.',
        type: 'boolean',
        required: false,
        defaultValue: defaults.isInteractive,
        controlType: 'switch',
        group: 'Interactivity',
    },
    {
        key: 'onMouseEnter',
        group: 'Interactivity',
        flavors: ['svg', 'html', 'canvas'],
        type: '(node: Node, event: MouseEvent) => void',
        help: 'onMouseEnter handler.',
    },
    {
        key: 'onMouseMove',
        group: 'Interactivity',
        flavors: ['svg', 'html', 'canvas'],
        type: '(node: Node, event: MouseEvent) => void',
        help: 'onMouseMove handler.',
    },
    {
        key: 'onMouseLeave',
        group: 'Interactivity',
        flavors: ['svg', 'html', 'canvas'],
        type: '(node: Node, event: MouseEvent) => void',
        help: 'onMouseLeave handler.',
    },
    {
        key: 'onClick',
        group: 'Interactivity',
        flavors: ['svg', 'html', 'canvas'],
        type: '(node: Node, event: MouseEvent) => void',
        help: 'onClick handler.',
    },
    ...motionProperties(['svg', 'html'], defaults),
]

export const groups = groupProperties(props)
