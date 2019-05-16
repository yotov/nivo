/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { settingsMapper } from '../../../lib/settings'

const labelMapper = value => {
    if (value === `n => \`\${n.name} (\${n.formattedValue})\``) {
        return n => `${n.name} (${n.formattedValue})`
    }
    return value
}

export default settingsMapper({
    label: labelMapper,
    parentLabel: labelMapper,
})
