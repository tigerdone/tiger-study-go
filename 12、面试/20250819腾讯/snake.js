function shortenClassNames(classNames) {
    // 存储原始类名与缩短后类名的映射
    const classMap = new Map();
    // 跟踪已使用的缩短类名，确保唯一性
    const usedShortNames = new Set();

    // 处理每个类名，生成其可能的缩短形式
    const processedClasses = classNames.map(className => {
        // 按下划线分割类名
        const parts = className.split('_');
        // 生成所有可能的缩短形式（从最短到最长）
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

    // 排序规则：优先处理部分数量多的类名（更长的原始类名）
    // 这样可以让长类名优先获得更短的缩写
    processedClasses.sort((a, b) => {
        if (b.parts.length !== a.parts.length) {
            return b.parts.length - a.parts.length;
        }
        // 部分数量相同则按原始名称排序，保证一致性
        return a.original.localeCompare(b.original);
    });

    // 为每个类名选择最短的唯一缩写
    processedClasses.forEach(item => {
        for (const shortcut of item.possible) {
            if (!usedShortNames.has(shortcut)) {
                classMap.set(item.original, shortcut);
                usedShortNames.add(shortcut);
                break;
            }
        }
    });

    return Object.fromEntries(classMap);
}

// 使用示例
const originalClasses = [
    // 'page_outer_container',
    // 'container_container',
    'b_b_ab',
    'a_b',
    'ab',
    // 'page_inner_container',
    // 'page_inner_data_row',
    // 'page_header',
    // 'page_footer',
    // 'modal_outer_container',
    // 'modal_inner_content',
    // 'form_input_field',
    // 'form_submit_button',
    // 'form_reset_button'
];

// 生成缩短后的类名
const shortenedClasses = shortenClassNames(originalClasses);

// 输出结果
console.log("原始类名 → 缩短后类名:");
Object.entries(shortenedClasses).forEach(([original, shortened]) => {
    console.log(`${original.padEnd(30)} → ${shortened}`);
});
