import AICanvas from "@/components/AICanvas";
import Header from "@/components/Common/Header/Header";

const AICanvasPage = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <Header left="AI Canvas" />
      <AICanvas />
    </div>
  );
};

export default AICanvasPage;
