const fs = require('fs');
const path = require('path');

const appModulePath = path.join(__dirname, 'src/app.module.ts');
let content = fs.readFileSync(appModulePath, 'utf8');

if (!content.includes('NotificationModule')) {
  // Thêm import
  content = content.replace(
    "import { UploadModule } from './module/upload/upload.module';",
    "import { UploadModule } from './module/upload/upload.module';\nimport { NotificationModule } from './module/notification/notification.module';"
  );

  // Thêm vào imports array
  content = content.replace(
    "UploadModule,\n  ],",
    "UploadModule,\n    NotificationModule,\n  ],"
  );
  
  fs.writeFileSync(appModulePath, content, 'utf8');
  console.log("Updated app.module.ts to include NotificationModule");
}
