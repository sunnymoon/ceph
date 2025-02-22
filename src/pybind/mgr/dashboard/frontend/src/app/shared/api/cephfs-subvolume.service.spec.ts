import { TestBed } from '@angular/core/testing';

import { CephfsSubvolumeService } from './cephfs-subvolume.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { configureTestBed } from '~/testing/unit-test-helper';

describe('CephfsSubvolumeService', () => {
  let service: CephfsSubvolumeService;
  let httpTesting: HttpTestingController;

  configureTestBed({
    imports: [HttpClientTestingModule],
    providers: [CephfsSubvolumeService]
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CephfsSubvolumeService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get', () => {
    service.get('testFS').subscribe();
    const req = httpTesting.expectOne('api/cephfs/subvolume/testFS');
    expect(req.request.method).toBe('GET');
  });
});
