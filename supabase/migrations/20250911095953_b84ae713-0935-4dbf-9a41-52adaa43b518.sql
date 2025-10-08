-- Create detections table for RescueVision
CREATE TABLE public.detections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  detection_id TEXT NOT NULL UNIQUE, -- External detection ID (like RSC001)
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_positive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.detections ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (rescue teams need to see all detections)
CREATE POLICY "Detections are viewable by everyone" 
ON public.detections 
FOR SELECT 
USING (true);

-- Policy for inserting detections (could be from detection systems or authenticated users)
CREATE POLICY "Anyone can insert detections" 
ON public.detections 
FOR INSERT 
WITH CHECK (true);

-- Policy for updating detections (authenticated users only)
CREATE POLICY "Authenticated users can update detections" 
ON public.detections 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_detections_updated_at
  BEFORE UPDATE ON public.detections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_detections_timestamp ON public.detections(timestamp DESC);
CREATE INDEX idx_detections_location ON public.detections(latitude, longitude);
CREATE INDEX idx_detections_status ON public.detections(status);
CREATE INDEX idx_detections_detection_id ON public.detections(detection_id);