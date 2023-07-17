'use client';

import axios from 'axios';
import { toast } from 'react-hot-toast';
import useExhibitModal from "@/app/hooks/useExhibitModal"
import Modal from "./Modal"
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import { useRouter } from 'next/navigation';


enum STEPS {
  CATEGORY = 0,
  IMAGES = 1,
  DESCRIPTION = 2,
  PRICE = 3,
}


const ExhibitModal = () => {

  const router = useRouter();
  const exhibitModal = useExhibitModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      brand: '',
      condition: '',
      imageSrc: '',
      price: 1,
      title: '',
      description: '',
    }
  });

  const category = watch('category');
  const imageSrc = watch('imageSrc');

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  const onBack = () => {
    setStep((value) => value - 1);
  }
  const onNext = () => {
    setStep((value) => value + 1);
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

    axios.post('/api/listings', data)
      .then(() => {
        toast.success('出品が完了しました!');
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY)
        exhibitModal.onClose();
      })
      .catch(() => {
        toast.error('もう一度お試しください');
      })
      .finally(() => {
        setIsLoading(false);
      })
  }




  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return '作成'
    }
    return 'Next'
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined
    }
    return 'Back'
  }, [step]);


  // bodycontent
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="商品のカテゴリーを選んでください"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue('category', category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        )
        )}
      </div>
    </div>
  )


  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="商品の写真を追加してください"
        />
        <ImageUpload
          onChange={(value) => setCustomValue('imageSrc', value)}
          value={imageSrc} />
      </div>
    )
  }


  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="商品の名前,ブランド名,状態,説明文を入力してください"
        />
        <Input
          id="title"
          label="商品名"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="brand"
          label="ブランド名"
          register={register}
          errors={errors}
          required
          disabled={isLoading}
        />
        <Input
          id="condition"
          label="商品の状態"
          register={register}
          errors={errors}
          required
          disabled={isLoading}
        />
        <Input
          id="description"
          label="商品の説明"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }


  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="価格を設定してください"
        />
        <Input
          id="price"
          label="価格"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }




  return (
    <Modal
      isOpen={exhibitModal.isOpen}
      title="Tech Marketに出品しよう！"
      onClose={exhibitModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}
    />
  )
}

export default ExhibitModal
