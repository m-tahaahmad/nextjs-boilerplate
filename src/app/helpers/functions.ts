export function apiResponse(
  success: boolean = true,
  data: any = null,
  status: number = 200
) {
  return Response.json({ success: success, data: data }, { status });
}

export function getUserId(req: any) {
  return (req as any).user.userId;
}
