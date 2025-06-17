import { addMonths, endOfMonth } from 'date-fns';
import { fetchFixedCosts, addFixedCost, updateNextPaymentDate } from '../../main/db';

// 支払日を計算するための関数
const calculateNextPaymentDate = (today: Date, frequency: string): Date => {
  let newNextPaymentDate: Date;

  switch (frequency) {
    case 'monthly':
      newNextPaymentDate = addMonths(today, 1);
      return endOfMonth(newNextPaymentDate);
    case 'quarterly':
      newNextPaymentDate = addMonths(today, 3);
      return endOfMonth(newNextPaymentDate);
    case 'annually':
      newNextPaymentDate = addMonths(today, 12);
      return endOfMonth(newNextPaymentDate);
    default:
      throw new Error(`未対応の頻度: ${frequency}`);
  }
};

// 固定費を登録し、次回支払日を更新する関数
export const registerFixedCosts = async () => {
  console.log('自動固定費登録を開始します...');

  try {
    // 固定費を取得
    const fixedCosts = await fetchFixedCosts();
    console.log(`取得した固定費の数: ${fixedCosts.length}`);

    // 今日の日付を取得
    const today = new Date();
    const todayISO = today.toISOString();

    // 固定費を自動登録
    for (const cost of fixedCosts) {
      const nextPaymentDate = new Date(cost.next_payment_date);

      // 次回支払日が今日を過ぎていた場合、自動登録
      if (nextPaymentDate <= today) {
        // 固定費の登録
        await addFixedCost(cost.description, cost.amount, todayISO, cost.next_payment_date, cost.payment_method, cost.category_id, cost.frequency);
        console.log(`固定費（${cost.description}）を自動登録しました`);

        // 次回支払日を計算
        const newNextPaymentDate = calculateNextPaymentDate(today, cost.frequency);

        // 次回支払日を更新（db.tsのupdateNextPaymentDate関数を使う）
        await updateNextPaymentDate(cost.id, newNextPaymentDate);
        console.log(`次回支払日を更新しました（ID: ${cost.id}）`);
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('自動固定費登録に失敗しました:', error.message);
      return { error: true, message: '自動固定費登録に失敗しました', details: error.message };
    } else {
      console.error('自動固定費登録に失敗しました: 不明なエラー');
      return { error: true, message: '自動固定費登録に失敗しました', details: '不明なエラーが発生しました' };
    }
  }
};
