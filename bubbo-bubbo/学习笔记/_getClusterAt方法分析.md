## _getClusterAt方法分析

### _getClusterAt方法的作用
`_getClusterAt`是LevelSystem类中的一个私有方法，用于获取游戏中指定网格位置处的气泡集群。它通过深度优先搜索算法，从指定位置开始递归查找连接的气泡，形成一个完整的气泡集群数组。

### matchType参数的作用
`matchType`是一个布尔值参数，用于控制气泡集群的匹配规则：

1. **当matchType为true时**：
   - 集群只包含与初始气泡类型相同的普通气泡，或者特殊气泡
   - 特殊气泡会被加入集群，但不会继续搜索该特殊气泡的邻居（防止将整个游戏板气泡加入集群）
   - 主要用于识别同色气泡集群，当集群达到一定大小（通常>2）时会被消除

2. **当matchType为false时**：
   - 集群包含所有连接的气泡，无论它们的类型是什么
   - 主要用于检查漂浮气泡，判断气泡是否连接到顶部

### 关键实现细节
- 使用深度优先搜索算法，通过`toVisit`数组管理待访问的气泡
- 跳过已访问的气泡和无效网格位置的气泡
- 特殊气泡有特殊处理逻辑：当`matchType`为true时，特殊气泡会被加入集群，但不会扩展其邻居

### 使用场景
1. **新气泡放置时**（第485行）：使用`matchType = true`查找同色集群
   ```typescript
   const cluster = this._getClusterAt(gridI, gridJ === -1 ? 0 : gridJ, true);
   ```

2. **检查漂浮气泡时**（第623行）：使用`matchType = false`查找所有连接的气泡
   ```typescript
   const cluster = this._getClusterAt(bubble.i, bubble.j, false);
   ```

这个方法是游戏核心逻辑的一部分，负责处理气泡消除和漂浮气泡检测等关键功能。
