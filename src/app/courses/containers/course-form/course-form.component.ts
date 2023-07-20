import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from 'src/app/services/courses.service';
import { UtilsFunctions } from 'src/app/shared/utils/UtilsFunctions';

import { ICourse } from '../../model/course';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  form = this.fb.group({
    _id: [''],
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]
    ],
    category: [
      '',
      [
        Validators.required,
      ]
    ],
  });

  constructor(
    private fb: FormBuilder,
    private courseService: CoursesService,
    private utilsFunctions: UtilsFunctions,
    private location: Location,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const course: ICourse = this.route.snapshot.data['course'];

    this.form.setValue({
      _id: course._id,
      name: course.name,
      category: course.category,
    });
  }

  onSubmit() {
    this.courseService.save(this.form.value).subscribe({
      next: result => {
        this.onError('Course created successfully.');

        this.onCancel();
      },
      error: err => {
        this.onError('Error creating course.');
      }
    });
  }

  onCancel() {
    this.location.back();
  }

  onSuccess(message: string) {
    this.utilsFunctions.showSnack(message);

    this.onCancel();
  }

  private onError(message: string) {
    this.utilsFunctions.showSnack(message);
  }

  getErrorMessage(formName: string) {
    const field = this.form.get(formName);

    if(field?.hasError('required')) {
      return 'Required field';
    }

    if(field?.hasError('minlength')) {
      const requiredLength = field.errors ? field.errors['minlength']['requiredLength'] : 5;
      return `Minimum length needs to be ${requiredLength}`;
    }

    if(field?.hasError('maxlength')) {
      const requiredLength = field.errors ? field.errors['maxlength']['requiredLength'] : 100;
      return `Maximum length needs to be ${requiredLength}`;
    }

    return 'Invalid field';
  }
}
