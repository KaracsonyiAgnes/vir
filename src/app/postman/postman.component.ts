import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";

interface StorageDataModel {
  requestType: string;
  requestText: string;
}

interface Headers {
  requestMethod: string;
  ok: string;
  status: string;
  statusText: string;
  type: string;
  url: string;
}

const STORAGE_KEY = 'fullStorage';

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
  headers: Headers;

  constructor(private http: HttpClient) {
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

  private getStorageData(): void {
    this.history = JSON.parse(localStorage.getItem(STORAGE_KEY));
  }

  private refreshStorageData(): void {
    const request = {
      requestType: this.requestForm.controls.requestType.value,
      requestText: this.requestForm.controls.requestText.value,
    } as StorageDataModel;

    const storage = JSON.parse(localStorage.getItem(STORAGE_KEY)) as StorageDataModel[] || [] as StorageDataModel[];
    storage.push(request);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));

    this.getStorageData();
    this.callEndpoint(request);
  }

  private callEndpoint(request: StorageDataModel): void {
    this.http[request.requestType](request.requestText, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json'),
      observe: 'response'
    })
      .subscribe(response => this.refreshResponse(response));
  }

  private refreshResponse(response): void {
    this.response = response.body;
    console.log(response.headers.keys());
    this.headers = {
      requestMethod: this.requestForm.controls.requestType.value.toString().toUpperCase(),
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      type: response.type,
      url: response.url
    } as Headers;
  }
}
