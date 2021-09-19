// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from '../src/app.module';
// import { LibrariesModule } from '../src/libraries/libraries.module';
// import { LibraryDataStore } from '../src/libraries/database/library.datastore';
// import { mock, when } from 'ts-mockito';
// import { Library } from '../src/libraries/database/library.entity';

// describe('LibrariesController (e2e)', () => {
//     let app: INestApplication;
//     let libraryDataStore: LibraryDataStore;

//     beforeEach(async () => {
//         libraryDataStore = mock(LibraryDataStore);

//         const moduleFixture: TestingModule = await Test.createTestingModule({
//             imports: [AppModule, LibrariesModule]
//         })
//         .overrideProvider(LibraryDataStore)
//         .useValue(libraryDataStore)
//         .compile();

//         app = moduleFixture.createNestApplication();
//         await app.init();
//     });

//     it('/ (GET)', () => {
//         when(libraryDataStore.list()).thenResolve([new Library(), new Library()]);

//         return request(app.getHttpServer())
//             .get('/libraries')
//             .expect(200)
//             .expect('Content-Type', /json/)
//             .then(response => {
//                 expect(response.body.length).toBe(2);
//             });
//     });
// });
