import { useBook } from '../context';
import { href } from '../router';

/**
 * 열람 기록을 켜고 끄는 판. 왼쪽 메뉴와 "자주 본 쪽" 보기에 들어간다.
 * 상태마다 지금 무엇이 필요한지와 누를 단추를 보여 준다(record.ts 의 상태 설명 참고).
 */
export function RecordPanel() {
  const { record, setView } = useBook();
  const rows = Object.values(record.pages);
  const views = rows.reduce((n, r) => n + r.views, 0);
  const done = rows.filter((r) => r.done !== undefined).length;

  if (!record.supported) {
    return (
      <div className="bf-record">
        <p>이 브라우저에는 HTML 옆의 파일에 적는 기능이 없어서 기록을 켤 수 없습니다. 크롬이나 엣지로 열면 켤 수 있습니다.</p>
      </div>
    );
  }
  return (
    <div className="bf-record">
      {record.status === 'off' && (
        <>
          <p>켜면 세이브 파일(JSON)에 쪽마다 연 횟수와 다 읽은 쪽을 적습니다. 꺼 두면 적지도 읽지도 않습니다.</p>
          <div className="bf-record-actions">
            <button type="button" className="is-main" onClick={() => void record.enable()}>
              기록 켜기
            </button>
          </div>
        </>
      )}
      {record.status === 'pick' && (
        <>
          <p>세이브 파일을 정해 주세요. 이 HTML 파일 옆에 두면 함께 옮기기 쉽습니다.</p>
          <div className="bf-record-actions">
            <button type="button" className="is-main" onClick={() => void record.create()}>
              새 세이브 파일 만들기
            </button>
            <button type="button" onClick={() => void record.open()}>
              있는 세이브 파일 열기
            </button>
            <button type="button" onClick={record.disable}>
              끄기
            </button>
          </div>
        </>
      )}
      {record.status === 'locked' && (
        <>
          <p>
            세이브 파일 <strong>{record.fileName}</strong>에 다시 이어야 합니다. 누르면 브라우저가 이 파일을 고쳐도 되는지 묻습니다.
          </p>
          <div className="bf-record-actions">
            <button type="button" className="is-main" onClick={() => void record.enable()}>
              이어 쓰기
            </button>
            <button type="button" onClick={() => void record.forget()}>
              다른 파일로
            </button>
            <button type="button" onClick={record.disable}>
              끄기
            </button>
          </div>
        </>
      )}
      {record.status === 'ready' && (
        <>
          <p>
            <strong>{record.fileName}</strong>에 적는 중입니다. 다 읽은 쪽 {done}, 열람 {views}번.
          </p>
          <div className="bf-record-actions">
            <a href={href({ name: 'front' })} onClick={() => setView('top')}>
              자주 본 쪽
            </a>
            <button type="button" onClick={() => void record.forget()}>
              다른 파일로
            </button>
            <button type="button" onClick={record.disable}>
              기록 끄기
            </button>
          </div>
        </>
      )}
      {record.status === 'error' && (
        <>
          <p className="bf-record-error">{record.error}</p>
          <div className="bf-record-actions">
            <button type="button" className="is-main" onClick={() => void record.forget()}>
              세이브 파일 다시 고르기
            </button>
            <button type="button" onClick={record.disable}>
              끄기
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/** 상단바에 뜨는 작은 단추: 기록을 켜 두었는데 이번에 연 뒤로 세이브 파일에 잇지 못했을 때만 보인다 */
export function RecordChip({ onMenu }: { onMenu: () => void }) {
  const { record } = useBook();
  if (record.status === 'locked')
    return (
      <button type="button" className="bf-record-chip" onClick={() => void record.enable()} title={`세이브 파일 ${record.fileName}에 다시 잇습니다`}>
        기록 이어 쓰기
      </button>
    );
  if (record.status === 'pick' || record.status === 'error')
    return (
      <button type="button" className="bf-record-chip" onClick={onMenu}>
        {record.status === 'pick' ? '세이브 파일 정하기' : '기록 오류'}
      </button>
    );
  return null;
}
