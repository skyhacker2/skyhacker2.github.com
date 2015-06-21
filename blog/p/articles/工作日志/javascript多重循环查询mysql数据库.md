#javascript多重循环查询mysql数据库

```

Pager.getList(function(pagers) {
	User.getStudents(pageIndex, function(students) {
		var count = 0;
		var end = pagers.length * students.length;
		var infos = [];
		for (var i = 0; i < students.length; i ++) {
			(function(i) {
				infos[i] = {
					student_id: students[i].student_id,
					student_name: students[i].student_name,
					grades: []
				};
				var finishOne = function(grade) {
					count++;
					infos[i].grades.push(grade);
					if(count == end) {
						res.render('exam/teacher-exam.html', {pagination: pagination, pagers: pagers, infos: infos});
					}
				}
	
				for (var j = 0;  j< pagers.length; j++) {
					(function(j) {
						Exam.getGrade(pagers[j].pager_id, students[i].student_id, function(grade) {
							if (grade > 0) {
								grade = grade + ' / ' + pagers[j].grade;
							} else {
								grade = '未完成';
							}
							finishOne(grade);
						});
					})(j);
					
				}
			})(i);
		}
	});
```