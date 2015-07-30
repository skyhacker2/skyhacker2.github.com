#iOS UITableView edit mode没有缩进

不要返回自定义的Cell，而是把CustomView加到UITableViewCell的contentView中，编辑的时候就会出现缩进了。

```
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"CustomCell" forIndexPath:indexPath];

//    cell.textLabel.text = @"Title";
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"CustomCell"];
    }

    [cell.contentView.subviews makeObjectsPerformSelector:@selector(removeFromSuperview)];
    AlarmCell *view = (AlarmCell*)[self createViewUsingNib:@"AlarmCell"];
//    view.swithcBtn.on = NO;
    [cell.contentView addSubview: view];

    view.translatesAutoresizingMaskIntoConstraints = NO;
    [cell.contentView addConstraint:[NSLayoutConstraint constraintWithItem:view
                                                                attribute:NSLayoutAttributeTop
                                                                relatedBy:NSLayoutRelationEqual
                                                                   toItem:cell.contentView
                                                                attribute:NSLayoutAttributeTop
                                                               multiplier:1.0f
                                                                 constant:0]];
    [cell.contentView addConstraint:[NSLayoutConstraint constraintWithItem:view
                                                                 attribute:NSLayoutAttributeBottom
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:cell.contentView
                                                                 attribute:NSLayoutAttributeBottom
                                                                multiplier:1.0f
                                                                  constant:0]];
    [cell.contentView addConstraint:[NSLayoutConstraint constraintWithItem:view
                                                                 attribute:NSLayoutAttributeLeading
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:cell.contentView
                                                                 attribute:NSLayoutAttributeLeft
                                                                multiplier:1.0f
                                                                  constant:0]];
    [cell.contentView addConstraint:[NSLayoutConstraint constraintWithItem:view
                                                                 attribute:NSLayoutAttributeTrailing
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:cell.contentView
                                                                 attribute:NSLayoutAttributeRight
                                                                multiplier:1.0f
                                                                  constant:0]];

    return cell;
}
```
