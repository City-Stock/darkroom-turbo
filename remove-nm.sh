# find all directories named "node_modules" within the current directory and its subdirectories
find . -name 'node_modules' -type d | while read dir
do
  echo "Removing $dir"
  rm -rf "$dir"
done

# find and remove all pnpm-lock.yaml files
echo "Removing pnpm-lock.yaml files"
find . -name 'pnpm-lock.yaml' -type f -exec rm -f {} \;