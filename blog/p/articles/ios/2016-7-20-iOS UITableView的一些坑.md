# iOS UITableView的一些坑

1  使用cell的setSelected方法把cell设置为已选择状态，之后tableview delegate的`- (void) tableView:(UITableView *)tableView didDeselectRowAtIndexPath:(NSIndexPath *)indexPath`方法不会进入。

要选择和不选择cell，应该用tableview的

`[tableView selectRowAtIndexPath:indexPath animated:NO scrollPosition:UITableViewScrollPositionNone];`

和

`[tableView deselectRowAtIndexPath:indexPath animated:NO];`

2 cell选择的时候，Separator有时候消失了。只能是自己加一个横线到cell里面。如果用了selectedBackgroundView，那么selectedBackgroudView也要加上。

```
UIView * lineAfterCell = [[UIView alloc] initWithFrame:CGRectMake(20, cell.frame.size.height - 1, cell.frame.size.width - 40, 0.5)];
[lineAfterCell setBackgroundColor:[UIColor lightGrayColor]];
[cell addSubview:lineAfterCell];

lineAfterCell = [[UIView alloc] initWithFrame:CGRectMake(20, cell.frame.size.height - 1, cell.frame.size.width - 40, 0.5)];
[lineAfterCell setBackgroundColor:[UIColor lightGrayColor]];
[cell.selectedBackgroundView addSubview:lineAfterCell];
```