/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { BasicTooltip } from '@nivo/tooltip'

const TreeMapNodeTooltip = ({ node, tooltip }) => (
    <BasicTooltip
        id={node.data.name}
        value={node.data.formattedValue}
        enableChip={true}
        color={node.style.color}
        renderContent={typeof tooltip === 'function' ? tooltip.bind(null, { node, ...node }) : null}
    />
)

TreeMapNodeTooltip.propTypes = {
    node: PropTypes.shape({
        id: PropTypes.string.isRequired,
        data: PropTypes.shape({
            name: PropTypes.string.isRequired,
            formattedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        }).isRequired,
        style: PropTypes.shape({
            color: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    tooltip: PropTypes.func,
}

export default memo(TreeMapNodeTooltip)
