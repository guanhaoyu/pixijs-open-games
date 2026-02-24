### 1. leftWall 和 rightWall

**作用**：这两个变量代表游戏中的左右墙壁，用于计算泡泡发射时的反弹轨迹。当泡泡碰到左右墙壁时，会根据反射定律改变方向。

**计算方式**：
```typescript
// Calculate the wall x and y positions
const wallX = designConfig.content.width * 0.5 - boardConfig.bubbleSize * 0.5;
const wallY = designConfig.content.height;

// Initialize the left wall line
this._leftWall = new Line();
this._leftWall.startNode.set(-wallX, 0);
this._leftWall.endNode.set(-wallX, -wallY);

// Initialize the right wall line
this._rightWall = new Line();
this._rightWall.startNode.set(wallX, 0);
this._rightWall.endNode.set(wallX, -wallY);
```

- `wallX`：墙壁的x坐标，计算方式是设计内容宽度的一半减去泡泡大小的一半，这样墙壁刚好位于泡泡排列的边缘。
- `wallY`：墙壁的高度，等于设计内容的高度。
- 左墙（leftWall）的起点是`(-wallX, 0)`，终点是`(-wallX, -wallY)`，表示从屏幕底部中央左侧开始，向上延伸的垂直线。
- 右墙（rightWall）的起点是`(wallX, 0)`，终点是`(wallX, -wallY)`，表示从屏幕底部中央右侧开始，向上延伸的垂直线。

### 2. roof

**作用**：roof代表游戏中的屋顶，用于计算泡泡发射时的反弹轨迹。当泡泡碰到屋顶时，会停止移动或反弹。

**初始化方式**：
```typescript
// Initialize the roof line
this._roof = new Line();
this._roof.startNode.set(wallX, 0);
this._roof.endNode.set(wallX, -wallY);
```

注意：在init方法中，roof的初始化与rightWall相同，但这是临时的，因为在updateRoof方法中会重新计算roof的位置。

**更新方式**：
```typescript
/** Update the roof line. */
public updateRoof() {
    // Update based on the lowest grid line's y position
    const wallX = designConfig.content.width * 0.5;
    const wallY = this.game.systems.get(LevelSystem).getLine('bottom').y;

    this._roof.startNode.set(-wallX, wallY + boardConfig.bubbleSize);
    this._roof.endNode.set(wallX, wallY + boardConfig.bubbleSize);
}
```

- 在updateRoof方法中，roof的位置会根据LevelSystem的bottom line位置更新。
- `wallX`：直接使用设计内容宽度的一半，作为屋顶的左右边界。
- `wallY`：获取当前游戏关卡的底部线条y坐标。
- 屋顶的起点是`(-wallX, wallY + boardConfig.bubbleSize)`，终点是`(wallX, wallY + boardConfig.bubbleSize)`，表示一条水平线，位于当前关卡底部线条上方一个泡泡大小的位置。

### 3. 轨迹计算

在calculateEdgeNodes方法中，这些墙壁用于计算泡泡的反弹轨迹：
1. 从大炮的位置和角度开始，计算一条射线。
2. 检查这条射线是否与屋顶、左墙或右墙相交。
3. 如果相交，计算反射角度，并从相交点开始，以新的角度继续计算下一段射线。
4. 重复这个过程，直到达到最大反射次数或射线不再与任何墙壁相交。
5. 最后，在这些计算出的点之间生成可视化的节点，显示泡泡的发射轨迹。

总结一下，leftWall、rightWall和roof是用于模拟游戏物理环境的边界，帮助计算泡泡发射时的反弹轨迹，从而提供给玩家一个可视化的瞄准辅助。




### 坐标系原点(0,0)的确定

通过查看代码，我发现游戏中的坐标系原点(0,0)是在**屏幕底部的中央位置**，这是在 `Game.ts` 文件的 `resize` 方法中明确设置的：

```typescript
// Game.ts - resize 方法
this.gameContainerPosition.x = w * 0.5;
this.gameContainerPosition.y = h;

this.gameContainer.x = this.gameContainerPosition.x;
this.gameContainer.y = this.gameContainerPosition.y;
```

这段代码将游戏容器的原点设置为屏幕宽度的一半、屏幕高度的位置，即屏幕底部中央。

### 坐标系方向

- **X轴**：向右为正，向左为负
- **Y轴**：向上为负，向下为正（这与常规数学坐标系相反）

### leftWall、rightWall 和 roof 的作用与位置计算

#### 1. 墙壁位置计算

在 `AimSystem.ts` 的 `init` 方法中，墙壁位置的计算基于 `designConfig.content.width` 和 `boardConfig.bubbleSize`：

```typescript
// 墙壁X坐标：内容宽度的一半减去泡泡大小的一半
const wallX = designConfig.content.width * 0.5 - boardConfig.bubbleSize * 0.5;
// 墙壁Y坐标：内容高度
const wallY = designConfig.content.height;
```

#### 2. 左墙(leftWall)

**作用**：定义游戏区域的左边界，用于计算泡泡反弹轨迹

```typescript
// 起点：左侧墙壁底部 (-wallX, 0)
this._leftWall.startNode.set(-wallX, 0);
// 终点：左侧墙壁顶部 (-wallX, -wallY)
this._leftWall.endNode.set(-wallX, -wallY);
```

#### 3. 右墙(rightWall)

**作用**：定义游戏区域的右边界，用于计算泡泡反弹轨迹

```typescript
// 起点：右侧墙壁底部 (wallX, 0)
this._rightWall.startNode.set(wallX, 0);
// 终点：右侧墙壁顶部 (wallX, -wallY)
this._rightWall.endNode.set(wallX, -wallY);
```

#### 4. 屋顶(roof)

**作用**：定义游戏区域的顶部边界，随关卡进度动态变化

```typescript
// 初始化为右墙相同的值（会在updateRoof中更新）
this._roof = new Line();
this._roof.startNode.set(wallX, 0);
this._roof.endNode.set(wallX, -wallY);
```

屋顶的实际位置会在 `updateRoof` 方法中动态更新：

```typescript
// 根据当前关卡底部线条位置计算屋顶
const wallX = designConfig.content.width * 0.5;
const wallY = this.game.systems.get(LevelSystem).getLine('bottom').y;

// 起点：左侧屋顶边缘 (-wallX, wallY + boardConfig.bubbleSize)
this._roof.startNode.set(-wallX, wallY + boardConfig.bubbleSize);
// 终点：右侧屋顶边缘 (wallX, wallY + boardConfig.bubbleSize)
this._roof.endNode.set(wallX, wallY + boardConfig.bubbleSize);
```

### 坐标系设计的意义

这种坐标系设计（原点在屏幕底部中央）非常适合泡泡龙这类游戏：

1. **发射逻辑简化**：泡泡从底部中央的大炮发射，使用(0,0)作为起点可以简化角度和力度计算
2. **边界处理直观**：左右墙壁对称分布在x轴两侧，屋顶位置动态调整
3. **反弹轨迹计算**：通过简单的几何计算就能实现泡泡在墙壁间的反弹效果

### 可视化理解

```
               (-wallX, -wallY)       (wallX, -wallY)
                    ┌──────────────────────────┐
                    │                          │
                    │                          │
(-wallX, 0) ────────┼──────────────────────────┼─────── (wallX, 0)
                    │           (0,0)          │
                    │                          │
```

通过这种坐标系设计，`AimSystem` 能够精确计算泡泡的反弹轨迹，为玩家提供准确的瞄准辅助。
