import { fetchFixedCosts, getSettingValue } from '../db';

export const getUpcomingFixedCostNotifications = async (
  thresholdDays: number = 3
): Promise<{ title: string; body: string }[]> => {
  // 通知設定を確認
  const notifyEnabled = await getSettingValue('notifyFixedCost');
  if (notifyEnabled !== 'true') {
    console.log('ユーザー設定により通知はスキップされました');
    return [];
  }

  const fixedCosts = await fetchFixedCosts();
  const today = new Date();

  return fixedCosts
    .filter((cost) => {
      if (!cost.next_payment_date) return false;

      const nextDate = new Date(cost.next_payment_date);
      const diffDays = Math.ceil(
        (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      return diffDays > 0 && diffDays <= thresholdDays;
    })
    .map((cost) => ({
      title: '固定費の支払予定',
      body: `${cost.description} の支払日が近づいています（${cost.next_payment_date}）`,
    }));
};
