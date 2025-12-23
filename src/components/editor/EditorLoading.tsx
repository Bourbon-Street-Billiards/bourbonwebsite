import Skeleton from "@/components/ui/Skeleton";
import styles from "@/app/panel/page.module.scss";
import EditorCard from "./card/EditorCard";

const EditorLoading = () => {
    return (
        <div className={styles.section}>
            <div className={styles.editorContent}>
                <Skeleton width="100%" height={54} />
                <div className={styles.cardGrid}>
                    <EditorCard data={null} loading={true} index={0} openEditEvent={() => { }} removeEvent={() => { }} saving={false} />
                    <EditorCard data={null} loading={true} index={1} openEditEvent={() => { }} removeEvent={() => { }} saving={false} />
                    <EditorCard data={null} loading={true} index={2} openEditEvent={() => { }} removeEvent={() => { }} saving={false} />
                    <EditorCard data={null} loading={true} index={3} openEditEvent={() => { }} removeEvent={() => { }} saving={false} />
                    <EditorCard data={null} loading={true} index={4} openEditEvent={() => { }} removeEvent={() => { }} saving={false} />
                </div>
            </div>
        </div>
    );
}

export default EditorLoading;