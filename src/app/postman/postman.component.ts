import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

interface StorageDataModel {
  requestType: string;
  requestText: string;
}

@Component({
  selector: 'app-postman',
  templateUrl: './postman.component.html',
  styleUrls: ['./postman.component.scss']
})
export class PostmanComponent implements OnInit {
  requestForm = new FormGroup({
    requestType: new FormControl(),
    requestText: new FormControl()
  });
  history: StorageDataModel[];
  response: string;

  constructor(private http: HttpClient) {}

  private getStorageData(): void {
    this.history = JSON.parse(localStorage.getItem('fullStorage'));
  }

  private refreshStorageData(): void {
    const request = {
      requestType: this.requestForm.controls.requestType.value,
      requestText: this.requestForm.controls.requestText.value,
    } as StorageDataModel;

    const storage = JSON.parse(localStorage.getItem('fullStorage')) as StorageDataModel[] || [] as StorageDataModel[];
    storage.push(request);

    localStorage.setItem('fullStorage', JSON.stringify(storage));

    this.getStorageData();
    this.callEndpoint(request);
  }

  private callEndpoint(request: StorageDataModel): void {
    this.http[request.requestType](request.requestText,{})
      .subscribe(response => this.refreshResponse(response))
  }

  private refreshResponse(response): void {
    this.response = response;
  }

  ngOnInit(): void {
    this.getStorageData();
  }

  formSent(): void {
    this.refreshStorageData();
  }

  clearHistory() {
    localStorage.clear();
    this.getStorageData();
  }
}
