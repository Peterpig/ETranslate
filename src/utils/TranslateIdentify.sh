text=$1
if [ ! -n "$text" ];then
    echo "文本为空！"
    exit 1
fi

trap 'rm -f "$TMPFILE"' EXIT

TMPFILE=$(mktemp)|| exit 1

echo $text >> $TMPFILE

res=`shortcuts run "Cloud.TranslateIdentify.v1"  -i $TMPFILE`

echo $res