#!/bin/bash
function update_user_default_application {
    aws cognito-idp admin-update-user-attributes \
      --user-pool-id $USER_POOL_ID \
      --username $USER \
      --user-attributes '[{"Name":"profile","Value":"{\"defaultApplicationId\":\"'"$APP"'\"}"}]'
}