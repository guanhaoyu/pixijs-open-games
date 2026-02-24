经过仔细分析，我认为**确实应该排除邻居中的特殊气泡**，当前实现存在一个逻辑问题：

### 当前实现的问题

1. **概率计算不准确**：
   - 特殊气泡类型会被添加到`chancePerType`中，增加`totalChance`的值
   - 但在`getChanceSelection`方法中，只遍历`boardConfig.bubbleTypes`（普通气泡类型）
   - 这导致`totalChance`包含了永远不会被选中的特殊气泡权重，使概率分布计算错误

2. **逻辑不一致**：
   - 特殊气泡有专门的生成逻辑（通过`_getSpecialType()`方法）
   - 不应该在普通气泡的选择过程中影响权重计算

### 修改建议

在邻居循环中添加对特殊气泡类型的检查，如果是特殊气泡类型则跳过：

```typescript
// Loop through all neighbors
for (let n = 0; n < neighbours.length; n += 1) {
    // Get the current neighbor
    const neighbour = neighbours[n];

    // Get the type of the current neighbor
    const type = neighbour.type;

    // Skip special bubble types to avoid affecting regular bubble selection
    if (isSpecialType(type)) {
        continue;
    }

    // Initialize the amount to 1
    let amount = 1;

    if (!chancePerType.has(type)) {
        // If the type doesn't exist in the chance per type map increase the amount by the heterogeneity
        amount += this._heterogeneity;
    } else {
        // Increase the amount by the current chance in the map
        amount += chancePerType.get(type)!;
    }

    // Set the new chance in the map
    chancePerType.set(type, amount);
    // Increase the total chance
    totalChance += 1;
}
```

### 好处

1. **概率分布准确**：`totalChance`只反映普通气泡的总权重
2. **代码逻辑清晰**：特殊气泡和普通气泡的生成逻辑完全分离
3. **游戏平衡性**：避免特殊气泡不当影响普通气泡的选择概率
4. **性能优化**：减少不必要的Map操作

这个修改可以确保轮盘赌选择算法的正确性，同时保持游戏设计的一致性。
