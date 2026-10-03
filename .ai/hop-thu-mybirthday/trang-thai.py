#!/usr/bin/env python3
"""In trạng thái hộp thư Gemini (mybirthday) (chỉ đọc, không ghi gì).
--gemini : 'MA|LY_DO|SO_XONG' của việc Gemini cần làm (sửa trước, làm mới sau), hoặc rỗng.
--claude : mỗi dòng 'MA|file xong mới nhất' đang chờ Claude review.
--all    : bảng tổng hợp."""
import os, re, sys, glob

H = os.path.dirname(os.path.abspath(__file__))


def mt(p):
    return os.path.getmtime(p)


def ketqua(p):
    try:
        return re.match(r"\s*KET_QUA:\s*(\w+)", open(p, encoding="utf-8").readline()).group(1)
    except Exception:
        return "?"


rows = []
for v in sorted(glob.glob(f"{H}/viec/B*.md")):
    ma = os.path.basename(v)[:-3]
    xs = glob.glob(f"{H}/xong/{ma}*.md")
    rs = glob.glob(f"{H}/review/{ma}*.md")
    lx = max(xs, key=mt) if xs else None
    lr = max(rs, key=mt) if rs else None
    if not lx:
        st = ("GEMINI", "lam_moi")
    elif not lr or mt(lr) < mt(lx):
        st = ("CLAUDE", "cho_review")
    else:
        kq = ketqua(lr)
        st = ("GEMINI", "sua") if kq in ("SUA", "CHUA_DAT") else ("XONG", kq)
    rows.append((ma, st, len(xs), lx, lr))

mode = sys.argv[1] if len(sys.argv) > 1 else "--all"
if mode == "--gemini":
    order = [r for r in rows if r[1] == ("GEMINI", "sua")] + [r for r in rows if r[1] == ("GEMINI", "lam_moi")]
    if order:
        print(f"{order[0][0]}|{order[0][1][1]}|{order[0][2]}")
elif mode == "--claude":
    for r in rows:
        if r[1][0] == "CLAUDE":
            print(f"{r[0]}|{os.path.basename(r[3])}")
else:
    for r in rows:
        print(r[0], r[1], f"xong={r[2]}")
