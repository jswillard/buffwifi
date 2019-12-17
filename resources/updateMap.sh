#!/usr/bin/env bash

curl -X PATCH "https://api.mapbox.com/datasets/v1/cnepp/ck3s2ua300r0z2omyrfjjnwzc?access_token=sk.eyJ1IjoiY25lcHAiLCJhIjoiY2s0OTU0cWZxMDFzdzNvbWh6cWdlMW0zNiJ9.c_W0oNNez2PO9mADxg49pA" -d @base_dataset_muninn.json
echo "Update Map"
