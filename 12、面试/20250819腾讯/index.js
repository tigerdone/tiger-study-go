function shortenClassNames(classNames) {
    const classBox = new Map();
    const usedShortNames = new Set();

    const processedClasses = classNames.map(className => {
        const parts = className.split('_');
        const possibleShortcuts = [];
        for (let i = parts.length - 1; i >= 0; i--) {
            possibleShortcuts.push(parts.slice(i).join('_'));
        }
        return {
            original: className,
            parts: parts,
            possible: possibleShortcuts
        };
    });

    processedClasses.sort((a, b) => {
        if (b.parts.length !== a.parts.length) {
            return b.parts.length - a.parts.length;
        }
        if (a.original < b.original) {
            return -1;
        } else if (a.original > b.original) {
            return 1;
        } else {
            return 0;
        }
    });

    processedClasses.forEach(item => {
        for (const shortcut of item.possible) {
            if (!usedShortNames.has(shortcut)) {
                classBox.set(item.original, shortcut);
                usedShortNames.add(shortcut);
                break;
            }
        }
    });

    const result = {};
    for (const [original, shortened] of classMap) {
        result[original] = shortened;
    }
    return result;
}