## patch

**树级别比较patch**

- 不存在新Vnode： 删

  ```js
  if (isUndef(vnode)) {
        if (isDef(oldVnode)) 
           invokeDestroyHook(oldVnode)
        return
  }
  ```

- 不存在旧Vnode：新增

  ```js
  if (isUndef(oldVnode)) {
        // empty mount (likely as component), create new root element
        isInitialPatch = true
        createElm(vnode, insertedVnodeQueue)
      }
  ```

-    新旧Vnode都存在执行diff, 执行更新

  ```js
  if (!isRealElement && sameVnode(oldVnode, vnode)) {
          // patch existing root node
          // diff发生的地方
          patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
        }
  ```

**递归的更新节点**

- 新旧Vnode均有文本且不同，文本更新

  ```js
  else if (oldVnode.text !== vnode.text) {
        // 更新文本操作
        nodeOps.setTextContent(elm, vnode.text)
      }
  ```

- 属性更新

  ```js
  //存在data，依次执行cbs中更新函数
  if (isDef(data) && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
        if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
      }
  ```

- 只有新Vnode有children,新增

  ```js
  else if (isDef(ch)) {
          // 要是老节点有文本清空之
          if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
        }
  ```

- 只有老Vnode有children,删除它们

  ```js
  else if (isDef(oldCh)) {
          // 老节点有孩子
          removeVnodes(oldCh, 0, oldCh.length - 1)
        }
  ```

- 只有老的有文本，清空处理

  ```
  else if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '')
        }
  ```

  

- 新旧Vnode均有孩子，重排updateChildren

  ```
  if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
        }
  ```

  updateChildren 重排整体策略

  首先假设新旧Children收尾都相同，则直接patch它们；若没有，则从旧children中查找跟新children首个节点相同的节点，如果找到了就patch它们，没有找到就删除；

  如果先遍历新旧其中一个children,循环结束，开始收尾工作：新children先结束，则老children剩下的会批量删除；如果旧children先结束，则新children剩下的会批量增加

  - 首尾两两对比过程

    ```js
    else if (sameVnode(oldStartVnode, newStartVnode)) {
            // 老开始和新开始相同，打补丁他们，游标同时向后移动
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
          } else if (sameVnode(oldEndVnode, newEndVnode)) {
            // 老结束和新结束相同，打补丁，游标向前移动
            patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
          } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
            // 老开始和新结束相同，打补丁之外，还要移动节点
            patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
            // 移动到老的队伍后面
            canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
          } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
           //老结束和新开始相同，打补丁，移动节点
            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            //移动到新的Vnode前面
            canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
          }
    ```

  - 在旧children中查找相同节点的过程

    ```js
    else {
            // 4中猜测情况全部结束，老老实实循环查找
            if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
            // 找到在老孩子数组中的位置
            idxInOld = isDef(newStartVnode.key)
              ? oldKeyToIdx[newStartVnode.key]
              : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
            if (isUndef(idxInOld)) { // New element
              // 如果没找到，创建
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
            } else {
              // 找到的话，如果是相同节点，打补丁，还要做移动操作
              vnodeToMove = oldCh[idxInOld]
              if (sameVnode(vnodeToMove, newStartVnode)) {
                patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
                oldCh[idxInOld] = undefined
                canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
              } else {
                // same key but different element. treat as new element
                createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
              }
            }
            newStartVnode = newCh[++newStartIdx]
          }
        }
    ```

  - 循环结束后的收尾工作处理

    ```js
    // 老数组先结束，批量增加
        if (oldStartIdx > oldEndIdx) {
          refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
          addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
        } else if (newStartIdx > newEndIdx) {
          // 新数组先结束，批量删除
          removeVnodes(oldCh, oldStartIdx, oldEndIdx)
        }
    ```

