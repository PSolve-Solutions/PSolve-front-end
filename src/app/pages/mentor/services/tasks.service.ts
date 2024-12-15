import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/model/responseHeader';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http:HttpClient) { }
  getData(id:any): Observable<ResponseHeader>{
    return this.http.get<ResponseHeader>(`${environment.BASE_URL}/api/Mentor/tasksOnStatus/${Number(id)}`)
  }
  getAssign(id:any): Observable<ResponseHeader>{
    return this.http.get<ResponseHeader>(`${environment.BASE_URL}/api/Mentor/getTraineeForAssign/${Number(id)}`)
  }
  trainees(id:any): Observable<ResponseHeader>{
    
    return this.http.get<ResponseHeader>(`${environment.BASE_URL}/api/Mentor/trainees?campId=${Number(id)}`)
  }
  addTask(data: any): Observable<any> {
    return this.http.post<any>(`${environment.BASE_URL}/api/Mentor/tasks`, data); 
  }
  del(data: any): Observable<any> {
    return this.http.delete<any>(`${environment.BASE_URL}/api/Mentor/tasks`,  {
      
      body: {
        "taskId":data
      }
    }); 
  }
  updTask(data: any): Observable<any> {
    return this.http.put<any>(`${environment.BASE_URL}/api/Mentor/tasks`,  {
        "taskId": data.taskId,
        "title": data.title,
        "startTime": data.startTime,
        "endTime": data.endTime,
        "traineeId": data.traineeId
      }
    ); 
  }
}
