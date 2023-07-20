import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first } from 'rxjs';

import { ICourse } from '../courses/model/course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = 'api/courses';

  constructor(
    private http: HttpClient,
  ) { }

  findAll() {
    return this.http.get<ICourse[]>(`${this.API}`)
      .pipe(
        first(),
      );
  }

  findById(courseId: number) {
    return this.http.get<ICourse>(`${this.API}/${courseId}`)
      .pipe(
        first(),
      );
  }

  delete(courseId: number) {
    return this.http.delete(`${this.API}/${courseId}`).pipe(first());
  }

  save(body: Partial<ICourse>) {
    return !!body._id ?
      this.update(body) :
      this.create(body);
  }

  private create(body: Partial<ICourse>) {
    return this.http.post<ICourse>(`${this.API}`, body).pipe(first());
  }

  private update(body: Partial<ICourse>) {
    return this.http.put<ICourse>(`${this.API}/${body._id}`, body).pipe(first());
  }
}
