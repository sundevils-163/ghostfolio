#!/bin/bash

# Usage: ./convert_schwab_lots_to_ghostfolio_awk.sh schwab-trans.csv accountId [output.csv]

input_file="$1"
account_id="$2"
output_file="${3:-${input_file%.*}_ghostfolio.csv}"

if [[ -z "$input_file" || -z "$account_id" ]]; then
  echo "Usage: $0 schwab-trans.csv accountId [output.csv]"
  exit 1
fi

# Extract symbol from the first line using grep/sed for POSIX compatibility
symbol=$(head -1 "$input_file" | grep -oE '[A-Z]{1,5}' | head -1)
if [[ -z "$symbol" ]]; then
  symbol="ACLAX"
fi

# Write header
printf "Date,Account,Code,Currency,Price,Quantity,Action,Fee,Note\n" > "$output_file"

awk -v symbol="$symbol" -v account_id="$account_id" -F',' 'NR>3 && $1!="" && $1!="\"Total\"" {
  # Remove quotes
  gsub(/\"/, "", $1); gsub(/\"/, "", $2); gsub(/\"/, "", $4);
  # Remove dollar sign from price
  gsub(/\$/,"", $4);
  # Date conversion MM/DD/YYYY to DD-MM-YYYY
  split($1, d, "/");
  if (length(d[1]) && length(d[2]) && length(d[3])) {
    date = sprintf("%02d-%02d-%04d", d[2], d[1], d[3]);
  } else {
    date = $1;
  }
  # Clean and round quantity and price
  qty = sprintf("%.3f", $2+0);
  price = sprintf("%.2f", $4+0);
  # Output
  print date "," account_id "," symbol ",USD," price "," qty ",buy,0.00,Lot purchase - " symbol
}' "$input_file" >> "$output_file"

echo "[INFO] Conversion complete! Output: $output_file" 