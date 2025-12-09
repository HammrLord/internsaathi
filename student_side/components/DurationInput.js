
import React, { useState, useEffect } from 'react';

const DurationInput = ({ value, onChange, required = false }) => {
    // Parse initial value "6 Months" -> { num: 6, unit: 'Months' }
    const parseValue = (val) => {
        if (!val) return { num: '', unit: 'Months' };
        const parts = val.split(' ');
        return {
            num: parts[0] || '',
            unit: parts[1] || 'Months'
        };
    };

    const [localState, setLocalState] = useState(parseValue(value));

    useEffect(() => {
        setLocalState(parseValue(value));
    }, [value]);

    const update = (num, unit) => {
        setLocalState({ num, unit });
        if (num) {
            onChange(`${num} ${unit}`);
        } else {
            onChange('');
        }
    };

    return (
        <div className="flex rounded-lg shadow-sm">
            <input
                type="number"
                min="1"
                value={localState.num}
                onChange={(e) => update(e.target.value, localState.unit)}
                className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 border-r-0"
                placeholder="Duration"
                required={required}
            />
            <select
                value={localState.unit}
                onChange={(e) => update(localState.num, e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-r-lg text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary border-l-0"
            >
                <option value="Weeks">Weeks</option>
                <option value="Months">Months</option>
                <option value="Years">Years</option>
            </select>
        </div>
    );
};

export default DurationInput;
