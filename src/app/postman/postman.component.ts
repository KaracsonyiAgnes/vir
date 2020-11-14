import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

interface StorageDataModel {
  requestType: string;
  requestText: string;
}

interface RequestHeaders {
  headerKey: string;
  headerValue: string;
  headerKey2: string;
  headerValue2: string;
}

interface RequestParams {
  paramKey: string;
  paramValue: string;
  paramKey2: string;
  paramValue2: string;
}

interface ResponseHeaders {
  requestMethod: string;
  ok: string;
  status: string;
  statusText: string;
  type: string;
  url: string;
  requestHeaders: string;
  requestParams: string;
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
    requestText: new FormControl(),
    headerKey: new FormControl(),
    headerValue: new FormControl(),
    headerKey2: new FormControl(),
    headerValue2: new FormControl(),
    paramKey: new FormControl(),
    paramValue: new FormControl(),
    paramKey2: new FormControl(),
    paramValue2: new FormControl(),
  });
  history: StorageDataModel[];
  response: string;
  headers: ResponseHeaders;

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

    const headers = {
      headerKey: this.requestForm.controls.headerKey.value,
      headerValue: this.requestForm.controls.headerValue.value,
      headerKey2: this.requestForm.controls.headerKey2.value,
      headerValue2: this.requestForm.controls.headerValue2.value,
    } as RequestHeaders;

    const params = {
      paramKey: this.requestForm.controls.paramKey.value,
      paramValue: this.requestForm.controls.paramValue.value,
      paramKey2: this.requestForm.controls.paramKey2.value,
      paramValue2: this.requestForm.controls.paramValue2.value,
    } as RequestParams;

    const reqHeaders = this.setHeaders(headers);
    const reqParams = this.setParams(params);

    this.http[request.requestType](request.requestText, {
      headers: reqHeaders,
      params: reqParams,
      observe: 'response'
    })
      .subscribe(response => this.refreshResponse(response, headers, params));
  }

  private setHeaders(headers: RequestHeaders): HttpHeaders {
    const reqHeaders = new HttpHeaders();

    headers.headerKey && headers.headerValue ? reqHeaders.set(headers.headerKey, headers.headerValue) : '';
    headers.headerKey2 && headers.headerValue2 ? reqHeaders.set(headers.headerKey2, headers.headerValue2) : '';
    return reqHeaders;
  }

  private setParams(params: RequestParams): HttpParams {
    const reqParams = new HttpParams();

    params.paramKey && params.paramValue ? reqParams.set(params.paramKey, params.paramValue) : '';
    params.paramKey2 && params.paramValue2 ? reqParams.set(params.paramKey2, params.paramValue2) : '';
    return reqParams;
  }

  private refreshResponse(response, headers: RequestHeaders, params: RequestParams): void {
    this.response = response.body;
    console.log(headers);
    this.headers = {
      requestMethod: this.requestForm.controls.requestType.value.toString().toUpperCase(),
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      type: response.type,
      url: response.url,
      requestHeaders: Object.values(headers).filter(string => !!string).toString(),
      requestParams: Object.values(params).filter(string => !!string).toString()
    } as ResponseHeaders;
  }
}
